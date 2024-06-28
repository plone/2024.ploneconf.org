"""Handle Logins."""
from plone import api
from ploneconf import logger


ADMIN_GROUP = "Administrators"
EDITORS_GROUP = "Site Administrators"


USERS = {
    "andreclimaco": [EDITORS_GROUP],
    "ericof": [ADMIN_GROUP],
    "fredvd": [ADMIN_GROUP],
    "jhgouveia": [EDITORS_GROUP],
    "luxcas": [EDITORS_GROUP],
    "rafahela": [EDITORS_GROUP],
}


def login_handler(event):
    """Add user to correct Group."""
    user = event.object
    username = user.getUserName()
    with api.env.adopt_roles(["Manager"]):
        groups = USERS.get(username, [])
        for groupname in groups:
            group = api.group.get(groupname=groupname)
            members = [m.getUserName() for m in api.user.get_users(group=group)]
            if username not in members:
                api.group.add_user(groupname=groupname, username=username)
            logger.info(f"Added user {username} to {groupname}")
