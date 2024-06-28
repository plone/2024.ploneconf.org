from Acquisition import aq_parent
from plone.app.multilingual.dx import directives as ml_directives
from plone.autoform import directives
from plone.dexterity.content import Container
from ploneconf import _
from zope import schema
from zope.interface import implementer
from zope.interface import Interface


class ISponsor(Interface):
    """Plone Conference Sponsor."""

    title = schema.TextLine(title=_("label_title", default="Title"), required=True)

    description = schema.Text(
        title=_("label_description", default="Summary"),
        description=_(
            "help_description", default="Used in item listings and search results."
        ),
        required=False,
        missing_value="",
    )

    directives.order_before(description="*")
    directives.order_before(title="*")
    ml_directives.languageindependent("title")


@implementer(ISponsor)
class Sponsor(Container):
    """Convenience subclass for ``Sponsor`` portal type."""

    @property
    def level(self) -> str:
        """Return the id of the parent object."""
        parent = aq_parent(self)
        return parent.id if parent else ""
