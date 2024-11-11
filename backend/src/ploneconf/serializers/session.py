from plone import api
from plone.restapi.interfaces import ISerializeToJson
from plone.restapi.interfaces import ISerializeToJsonSummary
from plone.restapi.serializer.dxcontent import SerializeToJson
from plone.restapi.serializer.summary import DefaultJSONSummarySerializer
from ploneconf import _
from ploneconf.content.keynote import IKeynote
from ploneconf.content.slot import ISlot
from ploneconf.content.talk import ITalk
from ploneconf.content.training import ITraining
from ploneconf.interfaces import IPloneconfLayer
from ploneconf.services.registration.training import GetRegistration
from ploneconf.services.registration.training import GetRegistrations
from ploneconf.services.schedule.bookmark import GetBookmark
from typing import List
from zope.component import adapter
from zope.component import getUtility
from zope.interface import implementer
from zope.schema.interfaces import IVocabularyFactory

import pytz


LANG_INDEPENDENT = {
    "token": "un",
    "title": _("Brazilian Portuguese or English"),
}


ATTRIBUTE_VOCABULARY = {
    "room": "ploneconf.vocabularies.slot_rooms",
    "session_audience": "ploneconf.vocabularies.slot_audiences",
    "portal_type": "plone.app.vocabularies.ReallyUserFriendlyTypes",
    "slot_category": "ploneconf.vocabularies.slot_categories",
    "session_language": "plone.app.vocabularies.SupportedContentLanguages",
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
        if api.user.get_current():
            bookmark = GetBookmark(self.context, self.request)
            result.update(bookmark(expand=True))
        return result


@implementer(ISerializeToJson)
@adapter(ISlot, IPloneconfLayer)
class SlotJSONSerializer(JSONSerializer):
    """ISerializeToJson adapter for a Slot."""


@implementer(ISerializeToJson)
@adapter(IKeynote, IPloneconfLayer)
class KeynoteJSONSerializer(JSONSerializer):
    """ISerializeToJson adapter for the Keynote."""


@implementer(ISerializeToJson)
@adapter(ITalk, IPloneconfLayer)
class TalkJSONSerializer(JSONSerializer):
    """ISerializeToJson adapter for the Talk."""


@implementer(ISerializeToJson)
@adapter(ITraining, IPloneconfLayer)
class TrainingJSONSerializer(JSONSerializer):
    """ISerializeToJson adapter for the Training."""

    def _manage_training_permission(self, user, training) -> bool:
        permissions = ["Review portal content", "Modify portal content"]
        for permission in permissions:
            if api.user.has_permission(permission, user=user, obj=training):
                return True
        return False

    def __call__(self, *args, **kwargs):
        training = self.context
        result = super().__call__(*args, **kwargs)
        is_anonymous = api.user.is_anonymous()
        allow_registration = training.allow_registration
        if not is_anonymous:
            user = api.user.get_current()
            user_groups = [g.getGroupName() for g in api.group.get_groups(user=user)]
            is_online = "online" in user_groups
            registration = GetRegistration(training, self.request)
            result.update(registration(expand=True))
            hasPermission = self._manage_training_permission(
                user=user.getUser(), training=training
            )
            result["available_seats"] = training.available_seats
            result["allow_registration"] = (
                allow_registration and training.available_seats > 0 and not is_online
            )
            if hasPermission:
                registrations = GetRegistrations(training, self.request)
                result.update(registrations(expand=True))
        return result


class JSONSummarySerializer(DefaultJSONSummarySerializer):
    """ISerializeToJsonSummary adapter for the Session contents."""

    def format_vocabulary_values(self, attr: str, value: set) -> List[dict]:
        """Get title and token for a value."""
        value = value or set()
        vocabulary = get_vocabulary(attr, self.context)
        response = []
        if isinstance(value, str):
            value = [
                value,
            ]
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
        summary = super().__call__()
        context = self.context
        track = self.format_vocabulary_values("track", context.track)
        room = self.format_vocabulary_values("room", context.room)
        slot_category = getattr(context, "slot_category", context.portal_type)
        session_language = getattr(context, "session_language", None)
        session_language = (
            self.format_vocabulary_values("session_language", session_language)
            if session_language
            else LANG_INDEPENDENT
        )
        summary.update(
            {
                "image_field": "preview_image",
                "track": track,
                "room": room,
                "start": include_timezone(context.start),
                "end": include_timezone(context.end),
                "slot_category": slot_category,
                "session_language": session_language,
            }
        )
        if api.user.get_current():
            bookmark = GetBookmark(self.context, self.request)
            summary.update(bookmark(expand=True))
        return summary


@implementer(ISerializeToJsonSummary)
@adapter(ISlot, IPloneconfLayer)
class SlotJSONSummarySerializer(JSONSummarySerializer):
    """ISerializeToJsonSummary adapter for a Slot."""


class SessionJSONSummarySerializer(JSONSummarySerializer):
    """ISerializeToJsonSummary adapter for Session contents."""

    def __call__(self):
        summary = super().__call__()
        context = self.context
        level = self.format_vocabulary_values("session_level", context.session_level)
        audience = self.format_vocabulary_values(
            "session_audience", context.session_audience
        )
        session_language = self.format_vocabulary_values(
            "session_language", context.session_language
        )
        presenters = []
        if bool(context.presenters):
            presenters = [
                {
                    "path": presenter.to_object.absolute_url_path(),
                    "title": presenter.to_object.title,
                }
                for presenter in context.presenters
            ]
        summary.update(
            {
                "level": level,
                "audience": audience,
                "session_language": session_language,
                "presenters": presenters,
            }
        )
        return summary


@implementer(ISerializeToJsonSummary)
@adapter(IKeynote, IPloneconfLayer)
class KeynoteJSONSummarySerializer(SessionJSONSummarySerializer):
    """ISerializeToJsonSummary adapter for the Keynote."""


@implementer(ISerializeToJsonSummary)
@adapter(ITalk, IPloneconfLayer)
class TalkJSONSummarySerializer(SessionJSONSummarySerializer):
    """ISerializeToJsonSummary adapter for the Talk."""


@implementer(ISerializeToJsonSummary)
@adapter(ITraining, IPloneconfLayer)
class TrainingJSONSummarySerializer(SessionJSONSummarySerializer):
    """ISerializeToJsonSummary adapter for the Training."""
