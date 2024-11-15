from pathlib import Path
from plone import api
from ploneconf import logger
from ploneconf.users.content.attendee import Attendee
from ploneconf.utils import generate_password
from zope.lifecycleevent import ObjectAddedEvent


CURRENT_FOLDER = Path(__file__).parent.resolve()
TEMPLATES_FOLDER = CURRENT_FOLDER / "email_templates"


TEMPLATES = {
    "created": {
        "pt-br": {
            "subject": (
                "Boas vindas à PythonCerrado|Plone Conference 2024! 🌟 Acesse Sua Conta e Comece Agora"
            ),
            "body": (TEMPLATES_FOLDER / "new_attendee_pt-br.txt").read_text(),
        },
        "en": {
            "subject": (
                "Welcome to Plone Conference|PythonCerrado 2024! 🌟 Access Your Account and Get Started."
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
    lang = "pt-br" if len(location) <= 2 else "en"
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


def attendee_added(attendee: Attendee, event: ObjectAddedEvent):
    """Handler for the object added event."""
    send_email(event="created", attendee=attendee)
