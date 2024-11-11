from dateutil.parser import parse
from ploneconf import logger
from ploneconf.settings import EVENTBRITE_BASE_URL
from ploneconf.settings import EVENTBRITE_EVENT_ID
from ploneconf.settings import EVENTBRITE_KEY
from ploneconf.settings import EVENTBRITE_ORG_ID
from ploneconf.utils import generate_password

import requests


ONLINE_TICKETS = ("1577135909", "1902047603")
ATTENDEES_DB = "/attendees"
ORDERS_URL = "https://www.eventbrite.com.br/organizations/orders"


def _check_settings() -> bool:
    return bool(EVENTBRITE_KEY and EVENTBRITE_EVENT_ID and EVENTBRITE_ORG_ID)


def get_endpoint(category: str, service: str) -> str:
    base = EVENTBRITE_BASE_URL
    event_id = EVENTBRITE_EVENT_ID
    organization_id = EVENTBRITE_ORG_ID
    params = ""
    if category == "event":
        endpoint = f"{base}/events/{event_id}/{service}/"
    else:
        params = "?scope=event&event_id={event_id}&page_size=300"
        endpoint = f"{base}/organizations/{organization_id}/{service}"
    return f"{endpoint}{params}"


def eventbrite_session() -> requests.Session | None:
    """Create a session to use Eventbrite."""
    if not _check_settings():
        return None
    headers = {"Authorization": f"Bearer {EVENTBRITE_KEY}"}
    session = requests.Session()
    session.headers.update(headers)
    return session


def _get_data(
    service: str, endpoint: str, base_params: dict | None = None
) -> list[dict]:
    """Get paginated data from eventbrite."""
    base_params = base_params if base_params else {}
    session = eventbrite_session()
    params = {k: v for k, v in base_params.items()}
    # First request
    response = session.get(endpoint, params=params)
    data = response.json()
    do_request = True
    items = []
    while do_request:
        response = session.get(endpoint, params=params)
        data = response.json()
        items.extend(data.get(service, []))
        if continuation := data.get("pagination", {}).get("continuation", ""):
            params["continuation"] = continuation
        else:
            do_request = False
        logger.debug(f"Got data from {service} (Total: {len(items)})")
    return items


def _guess_transitions(attendee: dict) -> str:
    transitions = []
    cancelled = attendee["cancelled"]
    if cancelled:
        transitions.append("cancel")
    refunded = attendee["refunded"]
    if refunded:
        transitions.append("refund")
    return transitions


def _attendee_to_plone_type(attendee: dict) -> dict:
    """Convert Eventbrite attendee info to a payload to be used with plone.api."""
    ticket_class_id = attendee["ticket_class_id"]
    type_ = "Attendee" if ticket_class_id not in ONLINE_TICKETS else "OnlineAttendee"
    payload = {}
    id_ = attendee["id"]
    order_id = attendee["order_id"]
    external_url = f"{ORDERS_URL}/{order_id}"
    passwd = generate_password(id_)
    email = attendee["profile"]["email"]
    created = parse(attendee["created"])
    payload["id"] = id_
    payload["type"] = type_
    payload["first_name"] = attendee["profile"]["first_name"]
    payload["last_name"] = attendee["profile"]["last_name"]
    payload["creation_date"] = created
    payload["email"] = email
    payload["password"] = passwd
    payload["confirm_password"] = passwd
    # Eventbrite
    payload["event_id"] = attendee["event_id"]
    payload["order_id"] = attendee["order_id"]
    payload["order_date"] = created
    payload["participant_id"] = id_
    payload["ticket_class_name"] = attendee["ticket_class_name"]
    payload["ticket_class_id"] = ticket_class_id
    payload["barcode"] = attendee["barcodes"][0]["barcode"]
    payload["ticket_url"] = external_url

    transitions = _guess_transitions(attendee)
    site_path = f"{ATTENDEES_DB}/{id_}"
    response = {
        "id": id_,
        "path": site_path,
        "transitions": transitions,
        "payload": payload,
    }
    return response


def get_attendees() -> list[dict]:
    service = "attendees"
    endpoint = get_endpoint("event", service)
    raw_attendees = _get_data(service, endpoint)
    attendees = []
    for raw_attendee in raw_attendees:
        attendees.append(_attendee_to_plone_type(raw_attendee))
    return attendees
