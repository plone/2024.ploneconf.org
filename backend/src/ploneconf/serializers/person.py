from collections import defaultdict
from plone.restapi.interfaces import ISerializeToJson
from plone.restapi.interfaces import ISerializeToJsonSummary
from plone.restapi.serializer.converters import json_compatible
from plone.restapi.serializer.dxcontent import SerializeToJson
from plone.restapi.serializer.summary import DefaultJSONSummarySerializer
from ploneconf.content.person import IPerson
from ploneconf.utils import generate_links_dict
from zope.component import adapter
from zope.component import getMultiAdapter
from zope.component import getUtility
from zope.interface import implementer
from zope.interface import Interface
from zope.schema.interfaces import IVocabularyFactory
from zope.schema.vocabulary import SimpleTerm
from zope.schema.vocabulary import SimpleVocabulary


@implementer(ISerializeToJsonSummary)
@adapter(IPerson, Interface)
class PersonJSONSummarySerializer(DefaultJSONSummarySerializer):
    """ISerializeToJsonSummary adapter for the Person."""

    def __call__(self):
        summary = super().__call__()
        summary["links"] = generate_links_dict(self.context)
        summary["labels"] = self.context.labels
        return summary


@implementer(ISerializeToJson)
@adapter(IPerson, Interface)
class PersonJSONSerializer(SerializeToJson):
    def group_activities(self):
        activities = []
        raw_activities = defaultdict(list)
        for activity in self.context.activities:
            raw_activities[activity.portal_type].append(
                getMultiAdapter((activity, self.request), ISerializeToJsonSummary)()
            )
        for portal_type in ["Keynote", "Training", "Talk"]:
            if portal_type not in raw_activities:
                continue
            activities.append(
                {"@type": portal_type, "items": raw_activities[portal_type]}
            )
        return activities

    def serialize_term(self, term: SimpleTerm) -> dict:
        """Given a simple term, serialize the object."""
        return getMultiAdapter((term, self.request), ISerializeToJson)()

    def get_labels(self) -> list[dict]:
        raw_labels = self.context.labels
        labels = []
        vocab: SimpleVocabulary = getUtility(
            IVocabularyFactory, "ploneconf.vocabularies.person_labels"
        )(self)
        for label in raw_labels:
            labels.append(self.serialize_term(vocab.by_token[label]))
        return labels

    def __call__(self, version=None, include_items=True):
        result = super().__call__(version, include_items)
        links = generate_links_dict(self.context)
        result.update(
            json_compatible(
                {
                    "activities": self.group_activities(),
                    "labels": self.get_labels(),
                    "links": links,
                }
            )
        )
        return result
