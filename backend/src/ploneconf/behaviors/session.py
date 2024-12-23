from plone.app.multilingual.dx import directives as ml_directives
from plone.app.textfield import RichText
from plone.app.z3cform.widget import SelectFieldWidget
from plone.autoform import directives
from plone.autoform.interfaces import IFormFieldProvider
from plone.supermodel import model
from ploneconf import _
from z3c.relationfield.schema import RelationChoice
from z3c.relationfield.schema import RelationList
from zope import schema
from zope.interface import provider


@provider(IFormFieldProvider)
class IConferenceSession(model.Schema):
    """Plone Conference Conference Session."""

    title = schema.TextLine(title=_("Title"), required=True)
    description = schema.Text(title=_("Abstract"), required=True)

    text = RichText(
        title=_("Details"),
        required=False,
        missing_value="",
    )

    # Presenters
    presenters = RelationList(
        title=_("Presenters"),
        description=_(""),
        value_type=RelationChoice(
            vocabulary="ploneconf.vocabularies.persons",
        ),
        required=False,
        default=[],
    )

    session_level = schema.Set(
        title=_("Level"),
        description=_("Target Level"),
        value_type=schema.Choice(
            vocabulary="ploneconf.vocabularies.slot_levels",
        ),
        required=False,
    )

    session_audience = schema.Set(
        title=_("Audience"),
        description=_("Target audience"),
        value_type=schema.Choice(
            vocabulary="ploneconf.vocabularies.slot_audiences",
        ),
        required=False,
    )
    session_language = schema.Choice(
        title=_("label_language", default="Language"),
        vocabulary="plone.app.vocabularies.SupportedContentLanguages",
        required=False,
        missing_value="",
    )
    directives.widget("session_language", SelectFieldWidget)

    _pretalx_id = schema.TextLine(title=_("PretalX id"), required=False)
    directives.order_before(
        _pretalx_id="*",
        session_audience="*",
        session_level="*",
        session_language="*",
        presenters="*",
        text="*",
        title="*",
    )
    ml_directives.languageindependent(
        *(
            "title",
            "text",
            "session_level",
            "session_audience",
        )
    )
