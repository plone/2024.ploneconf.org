from plone import api
from plone.dexterity.content import DexterityContent
from plone.uuid.interfaces import IUUID
from typing import Union
from zope.interface import implementer
from zope.interface import provider
from zope.schema.interfaces import IVocabularyFactory
from zope.schema.vocabulary import SimpleTerm
from zope.schema.vocabulary import SimpleVocabulary


class Vocabulary(SimpleVocabulary):
    """Vocabulary supporting value validation against the Catalog."""

    def __contains__(self, value: Union[DexterityContent, str]) -> bool:
        """used during validation to make sure the selected item is found with
        the specified query.

        value can be either a string (hex value of uuid or path) or a plone
        content object.
        """
        if not isinstance(value, str):
            value = IUUID(value)
        if value.startswith("/"):
            # it is a path query
            site_path = "/".join(api.portal.get().getPhysicalPath())
            path = f"{site_path}{value}"
            query = {"path": {"query": path, "depth": 0}}
        else:
            # its a uuid
            query = {"UID": value}
        return True if api.content.find(**query) else False


@implementer(IVocabularyFactory)
class PersonsVocabulary:
    """Vocabulary of available Persons"""

    def query(self) -> dict:
        """Query for Persons."""
        return {
            "portal_type": "Person",
            "sort_on": "sortable_title",
        }

    @staticmethod
    def prepare_title(result) -> str:
        """Return a friendly value to be used in the vocabulary.

        :param result: Catalog result.
        :returns: Friendly string representing the value.
        """
        return result.Title

    def __call__(self, context, query=None) -> Vocabulary:
        query = self.query()
        results = api.content.find(**query)
        terms = []
        for result in results:
            title = self.prepare_title(result)
            terms.append(SimpleTerm(result.getObject(), result.UID, title))
        return Vocabulary(terms)


PersonsVocabularyFactory = PersonsVocabulary()


@provider(IVocabularyFactory)
def person_labels(context):
    """Available Labels for a person."""
    return SimpleVocabulary(
        [
            SimpleTerm(value="keynote-speaker", title="Keynote"),
            SimpleTerm(value="instructor", title="Instructor"),
            SimpleTerm(value="speaker", title="Speaker"),
        ]
    )
