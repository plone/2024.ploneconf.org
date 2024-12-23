from pathlib import Path
from plone import api
from ploneconf import logger
from ploneconf.subscribers.user import add_to_groups
from ploneconf.subscribers.user import get_new_groups_for_user
from ploneconf.users.content.attendee import Attendee
from ploneconf.utils import generate_password
from zope.lifecycleevent import ObjectAddedEvent


CURRENT_FOLDER = Path(__file__).parent.resolve()
TEMPLATES_FOLDER = CURRENT_FOLDER / "email_templates"


TEMPLATES = {
    "created": {
        "pt-br": {
            "subject": (
                "Boas vindas à PythonCerrado|Plone Conference 2024! 🌟 "
                "Acesse Sua Conta e Comece Agora"
            ),
            "body": (TEMPLATES_FOLDER / "new_attendee_pt-br.txt").read_text(),
        },
        "en": {
            "subject": (
                "Welcome to Plone Conference|PythonCerrado 2024! 🌟 "
                "Access Your Account and Get Started."
            ),
            "body": (TEMPLATES_FOLDER / "new_attendee_en.txt").read_text(),
        },
    }
}

# Handle attendees with wrong locations
WRONG_LOCATIONS = {}


def send_email(event: str, attendee: Attendee):
    id_ = attendee.id
    answers = attendee.answers
    location = WRONG_LOCATIONS.get(id_, answers.get("222410619", ""))
    lang = "pt-br" if len(location) <= 2 or location.startswith("BR-") else "en"
    email_data = {
        "fullname": attendee.title,
        "password": generate_password(attendee.id),
        "email": attendee.email,
    }
    recipient = f"{email_data['fullname']} <{email_data['email']}>"
    templates = TEMPLATES.get(event, {}).get(lang)
    if not templates:
        logger.warning(f"No template found for {event} and {lang}")
    subject = templates["subject"]
    body = templates["body"].format(**email_data)
    logger.debug(body)
    api.portal.send_email(
        recipient=recipient,
        subject=subject,
        body=body,
        immediate=True,
    )
    logger.info(f"Sent welcome email in {lang} to {recipient}")


def add_attendee_to_groups(attendee: Attendee):
    user = api.user.get(userid=attendee.id)
    group_names = get_new_groups_for_user(user=user, content=attendee)
    add_to_groups(user, group_names=group_names)
    logger.info(f"Added {user} to {group_names}")


def attendee_added(attendee: Attendee, event: ObjectAddedEvent):
    """Handler for the object added event."""
    send_email(event="created", attendee=attendee)
    try:
        add_attendee_to_groups(attendee)
    except Exception as exc:
        logger.error(f"Error adding {attendee.id} to groups", exc_info=exc)
