from plone import api
from plone.dexterity.content import Container
from plone.schema.email import Email
from ploneconf import _
from typing import List
from zope.interface import implementer
from zope.interface import Interface


ACTIVITIES_TO_LABELS = {
    "Keynote": "keynote-speaker",
    "Talk": "speaker",
    "Training": "instructor",
}


class IPerson(Interface):
    """Plone Conference Person."""

    email = Email(
        title=_("Email address"),
        description=_("Personal e-mail address"),
    )


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
    def labels(self) -> List[str]:
        """Return a list of labels to be applied to this person.

        :returns: List of labels.
        """
        activities = self.activities
        labels = set()
        for activity in activities:
            portal_type = activity.portal_type
            if portal_type in ACTIVITIES_TO_LABELS:
                labels.add(ACTIVITIES_TO_LABELS[portal_type])
        return list(labels)
