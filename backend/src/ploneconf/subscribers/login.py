"""Handle Logins."""

from plone import api
from ploneconf import logger
from ploneconf.settings import CORE_TEAM
from ploneconf.settings import ORGANIZERS_CORE_GROUP
from ploneconf.settings import USER_CATEGORIES
from ploneconf.souper.access import Tracking


def get_new_groups_for_user(user) -> list:
    groups = set()
    current_groups = {group.getGroupName() for group in api.group.get_groups(user=user)}
    if user.getUserName() in CORE_TEAM:
        groups.add(ORGANIZERS_CORE_GROUP)
    uuid = user.getProperty("uuid")
    if uuid:
        category = user.getProperty("category")
        local_groups = USER_CATEGORIES.get(category, [])
        brains = api.content.find(UID=uuid, unrestricted=True)
        if brains:
            content = brains[0].getObject()
            local_groups.extend(USER_CATEGORIES.get(content.ticket_class_id, []))
            for name in local_groups:
                groups.add(name)
    groups = groups.difference(current_groups)
    return list(groups)


def add_to_groups(user):
    with api.env.adopt_roles(["Manager"]):
        group_names = get_new_groups_for_user(user)
        username = user.getUserName()
        for groupname in group_names:
            try:
                group = api.group.get(groupname)
            except ValueError:
                logger.warning(f"Group {groupname} does not exist")
                continue
            api.group.add_user(group=group, username=username)
            logger.info(f"Added user {username} to {groupname}")


def track(user):
    user_id = user.getUserId() if hasattr(user, "getUserId") else user.getId()
    tracking_api = Tracking()
    tracking_api.add(user_id=user_id, action="login")


def login_handler(event):
    """Add user to correct Group."""
    user = event.object
    # Track login
    track(user)
    # Add to groups
    add_to_groups(user)
