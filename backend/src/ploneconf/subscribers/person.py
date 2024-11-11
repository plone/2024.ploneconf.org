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


def modification_handler(obj, event):
    """After modifying a Conference Session, reindex the presenter."""
    attributes = set()
    for attrs in event.descriptions:
        for attr in attrs.attributes:
            attributes.add(attr)
    if "IPerson.attendee" in attributes:
        rel_attendee = obj.attendee
        if not rel_attendee:
            return

        attendee = rel_attendee.to_object
        logger.info(f"- {obj} object connected to {attendee}")
        bookmark_all_my_sessions(person=obj, attendee=attendee)
