from Acquisition import aq_parent
from plone import api
from plone.app.dexterity.behaviors import constrains
from plone.base.interfaces.constrains import ISelectableConstrainTypes
from ploneconf import logger


DAYS = [
    ["2024-11-25", "Day 1", "First day of training sessions"],
    ["2024-11-26", "Day 2", "Second day of training sessions"],
    ["2024-11-27", "Day 3", "First day of talks"],
    ["2024-11-28", "Day 4", "Second day of talks"],
    ["2024-11-29", "Day 5", "Third day of talks"],
    ["2024-11-30", "Day 6", "First day of sprints"],
    ["2024-12-01", "Day 7", "Second day of sprints"],
]

ALLOWED_TYPES = [
    "Break",
    "OpenSpace",
    "LightningTalks",
    "Meeting",
]


def create_structure(setup_tool):
    portal = api.portal.get()
    schedule = portal.en.schedule
    for o_id, o_title, o_description in DAYS:
        if o_id in schedule.objectIds():
            logger.info(f"- Content with id {o_id} already exists")
            continue
        content = api.content.create(
            container=schedule,
            type="Document",
            id=o_id,
            title=o_title,
            description=o_description,
        )
        logger.info(f"- Created content {content}")
        api.content.transition(content, transition="publish")
        logger.info(f"- Published content {content}")
        behavior = ISelectableConstrainTypes(content)
        if behavior:
            behavior.setConstrainTypesMode(constrains.ENABLED)
            behavior.setLocallyAllowedTypes(ALLOWED_TYPES)
            behavior.setImmediatelyAddableTypes(ALLOWED_TYPES)
        logger.info(f"- Restricted content allowed to be added on {content}")


ATTRS = ["id", "title", "description", "start", "end", "room", "track"]


def convert_meeting(setup_tool):
    portal = api.portal.get()
    schedule = portal.en.schedule
    for o_id, o_title, o_description in DAYS:
        content = schedule[o_id]
        behavior = ISelectableConstrainTypes(content)
        if behavior:
            behavior.setConstrainTypesMode(constrains.ENABLED)
            behavior.setLocallyAllowedTypes(ALLOWED_TYPES)
            behavior.setImmediatelyAddableTypes(ALLOWED_TYPES)
            logger.info(f"- Restricted content on {o_title} ({o_description})")

    brains = api.content.find(
        portal_type="Break", review_state="published", unrestricted=True
    )
    if not brains:
        logger.info("- No valid brain")
        return
    objs = [b.getObject() for b in brains]
    obj = [o for o in objs if o.slot_category == "meeting"]
    if not obj:
        logger.info("- Did not find the existing meeting")
        return
    obj = obj[0]
    container = aq_parent(obj)
    payload = {
        "container": container,
        "type": "Meeting",
    }
    for attr in ATTRS:
        value = getattr(obj, attr, None)
        if not value:
            continue
        payload[attr] = value
    # Delete existing
    logger.info(f"- Will delete object {obj}")
    api.content.delete(obj=obj)
    # Create new
    logger.info(f"- Will create object with payload {payload}")
    content = api.content.create(**payload)
    # Publish
    api.content.transition(obj=content, transition="publish")
    logger.info(f"- Published {content}")
