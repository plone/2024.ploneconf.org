from ploneconf.users.content.attendee import Attendee
from ploneconf.users.content.attendee import IAttendee
from zope.interface import implementer


class IOnlineAttendee(IAttendee):
    """An online attendee in the conference."""


@implementer(IOnlineAttendee)
class OnlineAttendee(Attendee):
    """An attendee in the conference."""
