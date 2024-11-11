from Acquisition import aq_base
from datetime import datetime
from plone import api
from plone.restapi.interfaces import ISerializeToJson
from plone.restapi.interfaces import ISerializeToJsonSummary
from plone.restapi.serializer.converters import json_compatible
from plone.restapi.serializer.dxcontent import SerializeToJson
from plone.restapi.serializer.summary import DefaultJSONSummarySerializer
from ploneconf.users.content.attendee import IAttendee
from ploneconf.utils import generate_links_dict
from zope.component import adapter
from zope.interface import implementer
from zope.interface import Interface


EVENTBRITE_FIELDS = [
    "event_id",
    "order_id",
    "order_date",
    "participant_id",
    "ticket_class_name",
    "ticket_class_id",
    "ticket_url",
    "barcode",
]


def eventbrite_data(attendee) -> dict:
    result = {}
    if not api.user.is_anonymous():
        user = api.user.get_current().getUser()
        api.user.is_anonymous
        hasPermission = api.user.has_permission(
            "Review portal content", user=user, obj=attendee
        )
        if hasPermission:
            result["email"] = attendee.email
            attendee = aq_base(attendee)
            for key in EVENTBRITE_FIELDS:
                value = getattr(attendee, key, None)
                if not value:
                    continue
                elif isinstance(value, datetime):
                    value = value.isoformat(sep="T")
                result[key] = value
    return result


@implementer(ISerializeToJsonSummary)
@adapter(IAttendee, Interface)
class AttendeeJSONSummarySerializer(DefaultJSONSummarySerializer):
    """ISerializeToJsonSummary adapter for the Attendee."""

    def __call__(self):
        summary = super().__call__()
        summary["Subject"] = self.context.categories
        summary["links"] = generate_links_dict(self.context)
        summary["eventbrite"] = eventbrite_data(self.context)
        return summary


@implementer(ISerializeToJson)
@adapter(IAttendee, Interface)
class AttendeeJSONSerializer(SerializeToJson):
    def __call__(self, version=None, include_items=True):
        result = super().__call__(version, include_items)
        links = generate_links_dict(self.context)
        result.update(
            json_compatible(
                {
                    "links": links,
                    "Subject": self.context.categories,
                    "eventbrite": eventbrite_data(self.context),
                },
            )
        )
        return result
