from plone.app.multilingual.dx import directives as ml_directives
from plone.autoform.interfaces import IFormFieldProvider
from plone.supermodel import model
from ploneconf import _
from zope import schema
from zope.interface import provider


@provider(IFormFieldProvider)
class IConferenceMaterials(model.Schema):
    """Plone Conference Conference Materials."""

    # Materials
    model.fieldset(
        "materials",
        label=_("Materials"),
        fields=["slides_url", "slides_embed", "video_url"],
    )

    slides_url = schema.URI(
        title=_("Slides"),
        description=_("URL of slides"),
        required=False,
    )

    slides_embed = schema.Text(
        title=_("Slides embed code"),
        description=_("Embed code for slides"),
        required=False,
    )

    video_url = schema.URI(
        title=_("Video"),
        description=_("URL of video"),
        required=False,
    )
    ml_directives.languageindependent(
        *(
            "slides_url",
            "slides_embed",
            "video_url",
        )
    )
