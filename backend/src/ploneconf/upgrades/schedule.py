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
