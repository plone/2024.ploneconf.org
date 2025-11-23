from ploneconf import _
from ploneconf.content.slot import ISlot
from ploneconf.content.slot import Slot
from zope import schema
from zope.interface import implementer


class IBreak(ISlot):
    """Plone Conference Break."""

    slot_category = schema.Choice(
        title=_("Category"),
        description=_("Category of the slot"),
        required=True,
        vocabulary="ploneconf.vocabularies.slot_categories",
    )


@implementer(IBreak)
class Break(Slot):
    """Convenience subclass for ``Break`` portal type."""
