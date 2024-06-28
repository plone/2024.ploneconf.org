from plone.dexterity.content import Container
from zope.interface import implementer
from zope.interface import Interface


class ISlot(Interface):
    """Plone Conference Slot."""


@implementer(ISlot)
class Slot(Container):
    """Convenience subclass for ``Slot`` portal type."""
