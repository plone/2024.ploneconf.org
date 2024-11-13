"""Handle Logins."""

from copy import deepcopy
from plone import api
from ploneconf import logger
from ploneconf.settings import CORE_TEAM
from ploneconf.settings import ORGANIZERS_CORE_GROUP
from ploneconf.settings import USER_CATEGORIES
from ploneconf.souper.access import Tracking


def _get_content_for_user(user):
    content = None
    uuid = user.getProperty("uuid")
    if uuid:
        brains = api.content.find(UID=uuid, unrestricted=True)
        content = brains[0].getObject() if brains else None
    return content


def _groups_for_user(portal_type, email, ticket_class_id) -> list[str]:
    groups = set()
    if email in CORE_TEAM:
        groups.add(ORGANIZERS_CORE_GROUP)
    local_groups = deepcopy(USER_CATEGORIES.get(portal_type, []))
    local_groups.extend(deepcopy(USER_CATEGORIES.get(ticket_class_id, [])))
    for name in local_groups:
        groups.add(name)
    return groups


def get_new_groups_for_user(user) -> list:
    current_groups = {group.getGroupName() for group in api.group.get_groups(user=user)}
    email = user.getUserName()
    content = _get_content_for_user(user)
    ticket_class_id = content.ticket_class_id if content else ""
    portal_type = content.portal_type if content else ""
    group_names = _groups_for_user(portal_type, email, ticket_class_id)
    group_names = group_names.difference(current_groups)
    return list(group_names)


def add_to_groups(user, group_names=None):
    with api.env.adopt_roles(["Manager"]):
        group_names = group_names if group_names else get_new_groups_for_user(user)
        username = user.getUserName()
        for groupname in group_names:
            try:
                group = api.group.get(groupname)
            except ValueError:
                logger.warning(f"Group {groupname} does not exist")
                continue
            if group:
                try:
                    api.group.add_user(group=group, username=username)
                except Exception:
                    continue
                else:
                    logger.info(f"Added user {username} to {groupname}")


def track(user):
    user_id = user.getUserId() if hasattr(user, "getUserId") else user.getId()
    tracking_api = Tracking()
    tracking_api.add(user_id=user_id, action="login")


def creation_handler(attendee, _event):
    """Add user to correct Group."""
    portal_type = attendee.portal_type
    email = attendee.email
    ticket_class_id = attendee.ticket_class_id
    group_names = _groups_for_user(portal_type, email, ticket_class_id)
    user = attendee.user
    add_to_groups(user, group_names)
    attendee.reindexObject(idxs=["Subject"])
    logger.info(f"Reindexed Subject for user {attendee.email}")


def login_handler(event):
    """Add user to correct Group."""
    user = event.object
    # Track login
    track(user)
    # Add to groups
    add_to_groups(user)
