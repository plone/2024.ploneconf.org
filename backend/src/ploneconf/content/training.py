from ploneconf import _
from ploneconf.content.slot import ISlot
from ploneconf.content.slot import Slot
from zope import schema
from zope.interface import implementer


class ITraining(ISlot):
    """Plone Conference Training Session."""

    duration = schema.Choice(
        title=_("Duration"),
        description=_("Duration of the training"),
        required=False,
        vocabulary="ploneconf.vocabularies.training_duration",
    )


@implementer(ITraining)
class Training(Slot):
    """Convenience subclass for ``Training`` portal type."""
