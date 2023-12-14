from plone.app.multilingual.dx import directives
from plone.autoform.interfaces import IFormFieldProvider
from plone.supermodel import model
from ploneconf import _
from zope import schema
from zope.interface import provider


@provider(IFormFieldProvider)
class ILinkInformation(model.Schema):
    """Plone Conference Link Information."""

    model.fieldset(
        "links",
        label=_("Links"),
        fields=[
            "remoteUrl",
            "twitter",
            "github",
            "mastodon",
            "instagram",
            "linkedin",
        ],
    )

    remoteUrl = schema.URI(
        title=_("Site"),
        description=_("Link to site"),
        required=False,
    )
    directives.languageindependent("remoteUrl")

    twitter = schema.URI(
        title=_("X"),
        description=_("X profile url"),
        required=False,
    )
    directives.languageindependent("twitter")

    github = schema.URI(
        title=_("GitHub"),
        description=_("GitHub profile organization"),
        required=False,
    )
    directives.languageindependent("github")

    mastodon = schema.URI(
        title=_("Mastodon"),
        description=_("Mastodon profile url"),
        required=False,
    )
    directives.languageindependent("mastodon")

    instagram = schema.URI(
        title=_("Instagram"),
        description=_("Instagram profile url"),
        required=False,
    )
    directives.languageindependent("instagram")

    linkedin = schema.URI(
        title=_("LinkedIn"),
        description=_("LinkedIn profile url"),
        required=False,
    )
    directives.languageindependent("linkedin")
