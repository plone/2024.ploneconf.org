from plone import api
from ploneconf import logger
from ploneconf.eventbrite import utils
from ploneconf.users.content.attendee import Attendee
from ploneconf.users.content.attendees import Attendees


ATTENDEE_TYPES = ["Attendee", "OnlineAttendee"]


def _existing_attendees() -> dict:
    brains = api.content.find(portal_type=ATTENDEE_TYPES, unrestricted=True)
    return {brain.getId: brain.review_state for brain in brains}


def create_attendees(container: Attendees, data: list[dict]) -> list[Attendee]:
    attendees = []
    for payload in data:
        attendee = api.content.create(container=container, **payload)
        logger.info(f"Created {attendee.portal_type} {attendee.absolute_url()}")
        attendees.append(attendee)
    return attendees


def update_attendees(data: list[dict], reindex: bool = False) -> list[Attendee]:
    attendees = []
    data = {i[0]: i[1] for i in data}
    brains = api.content.find(
        portal_type=ATTENDEE_TYPES, getId=[id_ for id_ in data], unrestricted=True
    )
    for brain in brains:
        payload = data[brain.getId]
        attendee = brain.getObject()
        for attr, value in payload.items():
            setattr(attendee, attr, value)
        if reindex:
            attendee.reindexObject()
        logger.info(f"Updated {attendee.absolute_url()}")
        attendees.append(attendee)
    return attendees


def transition_attendees(data: list[tuple]) -> list[Attendee]:
    attendees = []
    data = {i[0]: i[1] for i in data}
    brains = api.content.find(
        portal_type=ATTENDEE_TYPES, getId=[id_ for id_ in data], unrestricted=True
    )
    for brain in brains:
        transitions = data[brain.getId]
        attendee = brain.getObject()
        for transition in transitions:
            api.content.transition(attendee, transition)
            logger.info(
                f"Ran {transition} on {attendee.portal_type} {attendee.absolute_url()}"
            )
        attendees.append(attendee)
    return attendees


def sync(
    changed_since: str = "", update_attrs: list | None = None, reindex: bool = False
) -> dict:
    portal = api.portal.get()
    container = portal["attendees"]
    current = _existing_attendees()
    attendees = utils.get_attendees(changed_since)
    actions = {
        "create": [],
        "update": [],
        "transition": [],
    }
    for info in attendees:
        id_ = info["id"]
        transitions = info["transitions"]
        payload = info["payload"]
        local_state = current.get(id_)
        if local_state == "registered" and transitions:
            actions["transition"].append((id_, transitions))
        elif local_state is None:
            actions["create"].append(payload)
        else:
            if update_attrs:
                payload = {k: v for k, v in payload.items() if k in update_attrs}
                actions["update"].append((id_, payload))
            else:
                logger.debug(f"Attendee with id {id_} has no changes")
    report = {"created": 0, "transitioned": 0, "updated": 0}
    with api.env.adopt_roles(["Manager", "Reviewer"]):
        # Create users
        attendees = create_attendees(container, actions["create"])
        report["created"] = len(attendees)
        logger.info(f"Created {len(attendees)} attendees")
        if update_attrs:
            # Create users
            attendees = update_attendees(actions["update"], reindex)
            report["updated"] = len(attendees)
            logger.info(f"Updated {len(attendees)} attendees")

        # Transition users
        attendees = transition_attendees(actions["transition"])
        report["transitioned"] = len(attendees)
        logger.info(f"Transitioned {len(attendees)} attendees")
    return report
