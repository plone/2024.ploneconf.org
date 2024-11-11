from pathlib import Path

import json
import logging
import os
import random
import requests
import string


# Setup logging
logging.basicConfig()
logger = logging.getLogger("ploneconf.load_attendees")
logger.setLevel(logging.INFO)

CURRENT_FOLDER = Path(__file__).parent.resolve()
DATA_FOLDER = CURRENT_FOLDER / "data"
PASS_LEN = 12
PASS_CHARS = string.ascii_lowercase + string.hexdigits + "#@!"


BASE_URL = os.environ.get("BASE_URL", "http://localhost:8080/Plone/++api++/")
USER = os.environ.get("USER", "admin")
PASSWD = os.environ.get("PASSWD", "admin")
BASIC_AUTH = os.environ.get("BASIC_AUTH")
SHOULD_PUBLISH = bool(os.environ.get("SHOULD_PUBLISH"))
SHOULD_UPDATE = bool(os.environ.get("SHOULD_UPDATE"))

if not BASE_URL:
    raise RuntimeError("BASE_URL not set")

headers = {"Accept": "application/json"}

session = requests.Session()
session.headers.update(headers)
if BASIC_AUTH:
    session.auth = tuple(BASIC_AUTH.split("|"))

headers = {"Accept": "application/json"}

# Authenticate user
login_url = f"{BASE_URL}/@login"
response = session.post(login_url, json={"login": USER, "password": PASSWD})
data = response.json()
token = data["token"]
if BASIC_AUTH:
    session.cookies.set("auth_token", token)
else:
    session.headers.update({"Authorization": f"Bearer {token}"})


def generate_password(user_id: str, chars: int = PASS_LEN) -> str:
    random.seed(user_id)
    return "".join([random.choice(PASS_CHARS) for _ in range(chars)])


def guess_transitions(item: dict) -> str:
    transitions = []
    cancelled = item["cancelled"]
    if cancelled:
        transitions.append("cancel")
    refunded = item["refunded"]
    if refunded:
        transitions.append("refund")
    return transitions


def prepare_attendees(raw_data: list) -> dict:
    contents = {}
    for item in raw_data:
        ticket_class_id = item["ticket_class_id"]
        type_ = (
            "Attendee"
            if ticket_class_id not in ("1577135909", "1902047603")
            else "OnlineAttendee"
        )
        transitions = guess_transitions(item)
        value = {}
        id_ = item["id"]
        order_id = item["order_id"]
        external_url = f"https://www.eventbrite.com.br/organizations/orders/{order_id}"
        passwd = generate_password(id_)
        email = item["profile"]["email"]
        site_path = f"/attendees/{id_}"
        value["id"] = id_
        value["@id"] = site_path
        value["@type"] = type_
        value["first_name"] = item["profile"]["first_name"]
        value["last_name"] = item["profile"]["last_name"]
        value["order_date"] = item["created"]
        value["email"] = email
        value["password"] = passwd
        value["confirm_password"] = passwd
        # Eventbrite
        value["event_id"] = item["event_id"]
        value["order_id"] = item["order_id"]
        value["participant_id"] = id_
        value["ticket_class_name"] = item["ticket_class_name"]
        value["ticket_class_id"] = ticket_class_id
        value["barcode"] = item["barcodes"][0]["barcode"]
        value["ticket_url"] = external_url
        contents[site_path] = (value, transitions)
    return contents


def create(contents: dict):
    # Create content
    for path, (data, transitions) in contents.items():
        url = f"{BASE_URL}{path}"
        parent_path = "/".join(path.split("/")[:-1])[1:]
        response = session.get(url, allow_redirects=False)
        if response.status_code in (302, 404):
            response = session.post(f"{BASE_URL}/{parent_path}", json=data)
            if response.status_code > 300:
                breakpoint()
                logger.error(f"Error creating '{path}': {response.status_code}")
                continue
            else:
                if data["@type"] in ("Attendee", "OnlineAttendee"):
                    logger.info(
                        f"Conteúdo criado: {path},{data['@type']},{data['email']},{data['password']}"
                    )
        else:
            type_ = data["@type"]
            email = data["email"]
            password = data["password"]
            if type_ in ("Attendee", "OnlineAttendee"):
                logger.info(f"Content exists:: {path},{type_},{email},{password}")
        response_data = response.json()
        current_state = response_data["review_state"]
        for transition in transitions:
            if current_state not in ["registered"]:
                continue
            endpoint = f"{url}/@workflow/{transition}"
            response = session.post(endpoint, allow_redirects=False)
            status = response.status_code
            logger.info(f"Transitioning: {path} with {transition} (Status: {status})")


for name, func in (("attendees", prepare_attendees),):
    raw_data = json.loads((DATA_FOLDER / f"{name}.json").read_text())
    data = func(raw_data)
    create(data)
