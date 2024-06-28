from plone.dexterity.content import Container
from plone.supermodel import model
from ploneconf import _
from zope import schema
from zope.interface import implementer
from zope.interface import Interface


class ISponsorLevel(Interface):
    """Sponsorship Level."""

    model.fieldset(
        "visibility",
        label=_("Visibility"),
        fields=[
            "display_frontpage",
        ],
    )

    display_frontpage = schema.Bool(
        title=_("Display on Frontpage"),
        description=_("Should this level be displayed on the FrontPage?"),
        default=False,
        required=False,
    )


@implementer(ISponsorLevel)
class SponsorLevel(Container):
    """Convenience subclass for ``SponsorLevel`` portal type."""
