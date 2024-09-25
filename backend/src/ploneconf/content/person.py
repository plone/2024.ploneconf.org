from plone import api
from plone.app.multilingual.dx import directives as ml_directives
from plone.autoform import directives
from plone.dexterity.content import Container
from plone.schema.email import Email
from ploneconf import _
from typing import List
from zope import schema
from zope.interface import implementer
from zope.interface import Interface


PERMISSION = "cmf.ModifyPortalContent"


ACTIVITIES_TO_LABELS = {
    "Keynote": "keynote-speaker",
    "Talk": "speaker",
    "Training": "instructor",
}


class IPerson(Interface):
    """Plone Conference Person."""

    title = schema.TextLine(title=_("label_name", default="Name"), required=True)

    description = schema.Text(
        title=_("label_biography", default="Short Biography"),
        description=_(
            "help_description", default="Used in item listings and search results."
        ),
        required=False,
        missing_value="",
    )
    directives.order_before(description="*")
    directives.order_before(title="*")
    ml_directives.languageindependent("title")

    email = Email(
        title=_("Email address"),
        description=_("Personal e-mail address"),
    )
    ml_directives.languageindependent("email")

    categories = schema.List(
        title=_("Categories"),
        value_type=schema.Choice(
            vocabulary="ploneconf.vocabularies.person_labels",
        ),
        default=[],
        required=False,
    )
    directives.read_permission(categories=PERMISSION, email=PERMISSION)
    directives.write_permission(categories=PERMISSION, email=PERMISSION)
    _pretalx_id = schema.TextLine(title=_("PretalX id"), required=False)


@implementer(IPerson)
class Person(Container):
    """Convenience subclass for ``Person`` portal type."""

    @property
    def activities(self):
        """Return a list of activities connected to this person.

        :returns: List of activities connected to this person.
        """
        relations = api.relation.get(target=self, unrestricted=True)
        return [i.from_object for i in relations]

    @property
    def labels(self) -> List[dict]:
        """Return a list of labels to be applied to this person.

        :returns: List of labels.
        """
        labels = set()
        categories = self.categories
        activities = self.activities
        for category in categories:
            labels.add(category)
        for activity in activities:
            portal_type = activity.portal_type
            if portal_type in ACTIVITIES_TO_LABELS:
                labels.add(ACTIVITIES_TO_LABELS[portal_type])

        return list(labels)
