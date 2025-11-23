from plone import api
from ploneconf import logger
from ploneconf.vocabularies.slot import ROOMS
from Products.GenericSetup.tool import SetupTool


STREAMS_PAYLOAD = {
    "type": "Document",
    "id": "stream",
    "title": "Streaming",
    "description": "Streaming Management",
    "exclude_from_nav": True,
    "blocks": {
        "0e9b0e63-0f4e-404f-baf1-f02a5f0e8819": {"@type": "slate"},
        "5b74c792-90e4-4310-82df-d369b7f32f8c": {"@type": "title"},
        "888f0f6d-cc25-4fd6-b171-a18c22f25279": {
            "@type": "listing",
            "headlineTag": "h2",
            "styles": {},
            "variation": "grid",
        },
    },
    "blocks_layout": {
        "items": [
            "5b74c792-90e4-4310-82df-d369b7f32f8c",
            "888f0f6d-cc25-4fd6-b171-a18c22f25279",
            "0e9b0e63-0f4e-404f-baf1-f02a5f0e8819",
        ]
    },
}

USERS = [
    {
        "properties": {
            "fullname": "Media View",
            "location": "",
        },
        "email": "rafael@mediaview.com.br",
        "groups": ["streaming"],
        "roles": ["Member"],
        "username": "rafael@mediaview.com.br",
    }
]

GROUPS = {
    "streaming": {
        "groupname": "streaming",
        "title": "Streaming Team",
        "description": "Online streaming team",
        "roles": [],
        "groups": [],
    },
}


def create_user_groups(setup_tool: SetupTool):
    """Create user groups for the Conference."""
    for groupname, group_info in GROUPS.items():
        group = api.group.get(groupname=groupname)
        if group:
            logger.info(f"Group {groupname} exists")
            continue
        group = api.group.create(**group_info)
        logger.info(
            f"Created group {groupname} with roles {group_info['roles']} ({group})"
        )


def create_user(setup_tool: SetupTool):
    """Create additional users."""
    for user_info in USERS:
        username = user_info.get("username")
        user = api.user.get(username=username)
        if user:
            logger.info(f"User {username} exists")
            continue
        groups = user_info.pop("groups")
        user = api.user.create(**user_info)
        logger.info(f"Created user {username} with roles {user_info['roles']} ({user})")
        for group in groups:
            api.group.add_user(groupname=group, user=user)
            logger.info(f"Added user {username} to group {group}")


def create_structure(setup_tool: SetupTool):
    """Create a container named stream on the portal root."""
    groupname = "streaming"
    group = api.group.get(groupname=groupname)
    if not group:
        logger.info(f"Group {group} does not exist")
        return
    permission_id = "ploneconf: Manage Streaming"
    portal = api.portal.get()
    if "stream" not in portal.objectIds():
        folder = api.content.create(container=portal, **STREAMS_PAYLOAD)
        logger.info(f"Created {folder}")
    else:
        folder = portal["stream"]
    api.group.grant_roles(group=group, roles=["Reader"], obj=folder)
    logger.info(f"Granted role Reader to {group} on {folder}")
    folder.manage_permission(permission_id, ["Reader"], acquire=True)
    logger.info(f"Gave {permission_id} to role Reader on {folder}")
    for room_id, room_title in ROOMS:
        if "x4" in room_id or room_id in folder.objectIds():
            continue
        content = api.content.create(
            container=folder,
            type="Document",
            id=room_id,
            title=f"Streaming {room_title}",
            description=f"Streaming Management for {room_title}",
            exclude_from_nav=True,
        )
        logger.info(f"Created {content}")
