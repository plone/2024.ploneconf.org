from ploneconf.content.slot import ISlot
from ploneconf.content.slot import Slot
from zope.interface import implementer


class ILightningTalks(ISlot):
    """Plone Conference LightningTalks."""


@implementer(ILightningTalks)
class LightningTalks(Slot):
    """Convenience subclass for ``LightningTalks`` portal type."""
