from Acquisition import aq_parent
from plone.app.dexterity.textindexer import searchable
from plone.app.multilingual.dx import directives as ml_directives
from plone.app.textfield import RichText as RichTextField
from plone.app.z3cform.widgets.richtext import RichTextFieldWidget
from plone.autoform import directives
from plone.dexterity.content import Container
from plone.supermodel import model
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
    text = RichTextField(
        title=_("label_text", default="Text"),
        description="",
        required=False,
    )
    directives.widget("text", RichTextFieldWidget)
    model.primary("text")
    searchable("text")


@implementer(ISponsor)
class Sponsor(Container):
    """Convenience subclass for ``Sponsor`` portal type."""

    @property
    def level(self) -> str:
        """Return the id of the parent object."""
        parent = aq_parent(self)
        return parent.id if parent else ""
