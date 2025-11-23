from plone import api
from ploneconf import logger
from ploneconf.content.person import Person
from ploneconf.souper.access import SessionBookmarks
from ploneconf.users.content.attendee import Attendee


def bookmark_all_my_sessions(person: Person, attendee: Attendee):
    bookmarks_api = SessionBookmarks()
    activities = person.activities
    for activity in activities:
        review_state = api.content.get_state(activity)
        # Do not bookmark sessions not in the schedule
        if review_state != "published":
            continue
        slot_uuid = api.content.get_uuid(activity)
        bookmark = bookmarks_api.add(user_id=attendee.id, slot_id=slot_uuid)
        if bookmark:
            logger.info(f"- Bookmarked {activity} for user {attendee}")


def copy_picture(person: Person, attendee: Attendee):
    image = person.image
    if image:
        attendee.image = image
        logger.info(f"- Added image to user {attendee}")


def add_to_presenters_group(person: Person, attendee: Attendee):
    user = api.user.get(userid=attendee.id)
    username = user.getUserName()
    groupname = "presenters"
    try:
        group = api.group.get(groupname)
    except ValueError:
        logger.warning(f"Group {groupname} does not exist")
        return
    if group:
        try:
            api.group.add_user(group=group, username=username)
        except ValueError as exc:
            logger.error(
                f"- Error adding {person.title} to group {group}", exc_info=exc
            )
        else:
            logger.info(f"- Added {person.title} to group {group}")


def modification_handler(obj, event):
    """After modifying a Conference Session, reindex the presenter."""
    attributes = set()
    for attrs in event.descriptions:
        for attr in attrs.attributes:
            attributes.add(attr)
    if "IPerson.attendee" not in attributes:
        return
    rel_attendee = obj.attendee
    if not rel_attendee:
        return
    attendee = rel_attendee.to_object
    with api.env.adopt_roles(["Manager"]):
        logger.info(f"- {obj} object connected to {attendee}")
        bookmark_all_my_sessions(person=obj, attendee=attendee)
        copy_picture(person=obj, attendee=attendee)
        add_to_presenters_group(person=obj, attendee=attendee)
