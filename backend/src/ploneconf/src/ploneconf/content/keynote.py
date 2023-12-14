from ploneconf.content.slot import ISlot
from ploneconf.content.slot import Slot
from zope.interface import implementer


class IKeynote(ISlot):
    """Plone Conference Keynote."""


@implementer(IKeynote)
class Keynote(Slot):
    """Convenience subclass for ``Keynote`` portal type."""
