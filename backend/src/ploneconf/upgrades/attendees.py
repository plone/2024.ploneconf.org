from pathlib import Path
from plone import api
from plone.app.dexterity.behaviors import constrains
from plone.base.interfaces.constrains import ISelectableConstrainTypes
from ploneconf import eventbrite
from ploneconf import logger
from ploneconf.settings import GROUPS
from ploneconf.subscribers.user import creation_handler
from Products.GenericSetup.tool import SetupTool

import json


TYPES = [
    "Attendee",
    "OnlineAttendee",
]

ALLOWED_TYPES = TYPES + [
    "File",
]

LOCAL_PATH = Path(__file__).parent


def install_membrane(setup_tool: SetupTool):
    setup_tool.runAllImportStepsFromProfile("Products.membrane:default")
    logger.info("- Installed Products.membrane")


def create_structure(setup_tool: SetupTool):
    permission_id = "ploneconf: Add Attendees"
    roles = ["Manager", "Site Administrator"]
    portal = api.portal.get()
    portal.manage_permission(permission_id, roles, acquire=False)
    if "attendees" not in portal.objectIds():
        # Create Attendees folder
        data = json.loads((LOCAL_PATH / "attendees.json").read_text())
        content = api.content.create(
            container=portal,
            type="Attendees",
            id="attendees",
            title="Conference Attendees",
            description="Attendees information",
            **data,
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
        # Remove permission on /
    portal.manage_permission(permission_id, [], acquire=False)


def create_user_groups(setup_tool: SetupTool):
    """Create user groups for the Conference."""
    for groupname, group_info in GROUPS.items():
        group = api.group.create(**group_info)
        logger.info(
            f"Created group {groupname} with roles {group_info['roles']} ({group})"
        )


def populate_answers(setup_tool: SetupTool):
    report = eventbrite.sync(update_attrs=["answers"], reindex=False)
    logger.info(f"Ran sync {report}")


def reindex_subject(setup_tool: SetupTool):
    brains = api.content.find(portal_type=TYPES)
    for brain in brains:
        attendee = brain.getObject()
        creation_handler(attendee, None)
        logger.info(f"Added {attendee} groups")
        attendee.reindexObject(idxs=["Subject"])
        logger.info(f"Reindexed {attendee.title}")
