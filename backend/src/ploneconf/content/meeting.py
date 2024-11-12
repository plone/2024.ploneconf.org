from plone.autoform import directives
from ploneconf import _
from ploneconf.content.slot import ISlot
from ploneconf.content.slot import Slot
from zope import schema
from zope.interface import implementer


class IMeeting(ISlot):
    """Plone Conference Meeting."""

    slot_category = schema.Choice(
        title=_("Category"),
        description=_("Category of the slot"),
        required=True,
        default="meeting",
        vocabulary="ploneconf.vocabularies.slot_categories",
    )
    directives.omitted("slot_category")


@implementer(IMeeting)
class Meeting(Slot):
    """Convenience subclass for ``Meeting`` portal type."""
