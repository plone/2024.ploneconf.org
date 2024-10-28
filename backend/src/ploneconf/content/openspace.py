from ploneconf.content.slot import ISlot
from ploneconf.content.slot import Slot
from zope.interface import implementer


class IOpenSpace(ISlot):
    """Plone Conference OpenSpace."""


@implementer(IOpenSpace)
class OpenSpace(Slot):
    """Convenience subclass for ``OpenSpace`` portal type."""
