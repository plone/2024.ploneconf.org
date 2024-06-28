from ploneconf import _
from ploneconf.content.slot import ISlot
from ploneconf.content.slot import Slot
from zope import schema
from zope.interface import implementer


class ITalk(ISlot):
    """Plone Conference Talk."""

    duration = schema.Choice(
        title=_("Duration"),
        description=_("Duration of the talk"),
        required=False,
        vocabulary="ploneconf.vocabularies.talk_duration",
    )


@implementer(ITalk)
class Talk(Slot):
    """Convenience subclass for ``Talk`` portal type."""
