from plone import api
from plone.restapi.interfaces import ISerializeToJson
from plone.restapi.interfaces import ISerializeToJsonSummary
from plone.restapi.serializer.converters import json_compatible
from plone.restapi.serializer.dxcontent import SerializeToJson
from ploneconf.content.keynote import IKeynote
from ploneconf.content.talk import ITalk
from ploneconf.content.training import ITraining
from typing import List
from zope.component import adapter
from zope.component import getUtility
from zope.interface import implementer
from zope.interface import Interface
from zope.schema.interfaces import IVocabularyFactory

import pytz


ATTRIBUTE_VOCABULARY = {
    "session_audience": "ploneconf.vocabularies.slot_audiences",
    "session_level": "ploneconf.vocabularies.slot_levels",
    "track": "ploneconf.vocabularies.slot_tracks",
}


def get_vocabulary(attr: str, context):
    name = ATTRIBUTE_VOCABULARY.get(attr)
    factory = getUtility(IVocabularyFactory, name)
    return factory(context)


def include_timezone(date):
    """Ensure that the date include the timezone specified in Plone config"""
    if not date:
        return date
    tz = pytz.timezone(api.portal.get_registry_record("plone.portal_timezone"))
    utc_tz = pytz.timezone("utc")
    return utc_tz.localize(date).astimezone(tz).isoformat()


class JSONSerializer(SerializeToJson):
    """ISerializeToJson adapter for Session contents."""

    def __call__(self, *args, **kwargs):
        result = super().__call__(*args, **kwargs)
        result["start"] = include_timezone(self.context.start)
        result["end"] = include_timezone(self.context.end)
        return result


@implementer(ISerializeToJson)
@adapter(IKeynote, Interface)
class KeynoteJSONSerializer(JSONSerializer):
    """ISerializeToJson adapter for the Keynote."""


@implementer(ISerializeToJson)
@adapter(ITalk, Interface)
class TalkJSONSerializer(JSONSerializer):
    """ISerializeToJson adapter for the Talk."""


@implementer(ISerializeToJson)
@adapter(ITraining, Interface)
class TrainingJSONSerializer(JSONSerializer):
    """ISerializeToJson adapter for the Training."""


class JSONSummarySerializer:
    """ISerializeToJsonSummary adapter for the Session contents."""

    def __init__(self, context, request):
        self.context = context
        self.request = request

    def format_vocabulary_values(self, attr: str, value: set) -> List[dict]:
        """Get title and token for a value."""
        value = value or set()
        vocabulary = get_vocabulary(attr, self.context)
        response = []
        for item in value:
            term = vocabulary.getTerm(item)
            response.append(
                {
                    "title": term.title,
                    "token": term.token,
                }
            )
        return response

    def __call__(self):
        context = self.context
        level = self.format_vocabulary_values("session_level", context.session_level)
        audience = self.format_vocabulary_values(
            "session_audience", context.session_audience
        )
        track = self.format_vocabulary_values("track", context.track)
        summary = json_compatible(
            {
                "@id": self.context.absolute_url(),
                "@type": self.context.portal_type,
                "title": self.context.title,
                "description": self.context.description,
                "level": level,
                "audience": audience,
                "track": track,
                "start": include_timezone(context.start),
                "end": include_timezone(context.end),
            }
        )
        return summary


@implementer(ISerializeToJsonSummary)
@adapter(IKeynote, Interface)
class KeynoteJSONSummarySerializer(JSONSummarySerializer):
    """ISerializeToJsonSummary adapter for the Keynote."""


@implementer(ISerializeToJsonSummary)
@adapter(ITalk, Interface)
class TalkJSONSummarySerializer(JSONSummarySerializer):
    """ISerializeToJsonSummary adapter for the Talk."""


@implementer(ISerializeToJsonSummary)
@adapter(ITraining, Interface)
class TrainingJSONSummarySerializer(JSONSummarySerializer):
    """ISerializeToJsonSummary adapter for the Training."""
