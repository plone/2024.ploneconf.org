from plone.dexterity.content import Container
from plone.supermodel import model
from zope.interface import implementer


class IAttendees(model.Schema):
    """Attendees database."""


@implementer(IAttendees)
class Attendees(Container):
    """Attendees database."""
