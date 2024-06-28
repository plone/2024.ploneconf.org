from plone.dexterity.content import Container
from zope.interface import implementer
from zope.interface import Interface


class ISponsorsDB(Interface):
    """Plone Conference Sponsors Database."""


@implementer(ISponsorsDB)
class SponsorsDB(Container):
    """Convenience subclass for ``SponsorsDB`` portal type."""
