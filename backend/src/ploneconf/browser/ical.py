from Acquisition import aq_inner
from datetime import datetime
from plone import api
from plone.app.event.ical.exporter import add_to_zones_map
from plone.event.interfaces import IICalendarEventComponent
from plone.event.utils import utc
from ploneconf.behaviors.schedule import IScheduleSlot
from ploneconf.souper.access import SessionBookmarks
from zope.component import getUtility
from zope.interface import implementer
from zope.publisher.browser import BrowserView
from zope.schema.interfaces import IVocabularyFactory

import icalendar
import pytz


PRODID = "-//Plone.org//NONSGML plone.app.event//EN"
VERSION = "2.0"


def construct_icalendar(context, events: list):
    """Returns an icalendar.Calendar object.

    :param context: A content object, which is used for calendar details like
                    Title and Description. Usually a container, collection or
                    the event itself.
    """
    tz = api.portal.get_registry_record("plone.portal_timezone")
    cal = icalendar.Calendar()
    cal.add("prodid", PRODID)
    cal.add("version", VERSION)
    cal.add("x-wr-timezone", tz)

    tzmap = {}
    vocabs = {
        "rooms": getUtility(IVocabularyFactory, "ploneconf.vocabularies.slot_rooms")(
            context
        )
    }
    for event in events:
        tz_start = tz_end = tz
        tzmap = add_to_zones_map(tzmap, tz_start, event.start)
        tzmap = add_to_zones_map(tzmap, tz_end, event.end)
        cal.add_component(IICalendarEventComponent(event).to_ical(vocabs))

    for tzid, transitions in tzmap.items():
        cal_tz = icalendar.Timezone()
        cal_tz.add("tzid", tzid)
        cal_tz.add("x-lic-location", tzid)

        for transition, tzinfo in transitions.items():
            if tzinfo["dst"]:
                cal_tz_sub = icalendar.TimezoneDaylight()
            else:
                cal_tz_sub = icalendar.TimezoneStandard()

            cal_tz_sub.add("tzname", tzinfo["name"])
            cal_tz_sub.add("dtstart", transition)
            cal_tz_sub.add("tzoffsetfrom", tzinfo["tzoffsetfrom"])
            cal_tz_sub.add("tzoffsetto", tzinfo["tzoffsetto"])
            cal_tz.add_component(cal_tz_sub)
        cal.add_component(cal_tz)

    return cal


@implementer(IICalendarEventComponent)
class ICalendarSlotComponent:
    """Returns an icalendar object of the event."""

    def __init__(self, context):
        self.context = context
        self.event = self.context
        self.ical = icalendar.Event()
        self.tz = pytz.timezone(api.portal.get_registry_record("plone.portal_timezone"))
        self.utc_tz = pytz.timezone("utc")

    @property
    def dtstamp(self):
        # must be in uc
        return {"value": utc(datetime.now())}

    @property
    def created(self):
        # must be in uc
        return {"value": utc(self.event.created())}

    @property
    def last_modified(self):
        # must be in uc
        return {"value": utc(self.event.modified())}

    @property
    def uid(self):
        uid = api.content.get_uuid(self.event)
        return {"value": uid}

    @property
    def url(self):
        return {"value": self.event.absolute_url()}

    @property
    def summary(self):
        return {"value": self.event.title}

    @property
    def description(self):
        return {"value": self.event.description}

    @property
    def dtstart(self):
        return {"value": self.utc_tz.localize(self.event.start).astimezone(self.tz)}

    @property
    def dtend(self):
        return {"value": self.utc_tz.localize(self.event.end).astimezone(self.tz)}

    @property
    def recurrence(self):
        return None

    @property
    def location(self):
        vocabs_room = self.vocabs.get("rooms")
        room = self.event.room
        room = list(room)[0] if room else ""
        if room and vocabs_room:
            term = vocabs_room.getTerm(room)
            room = term.title
        return {"value": room}

    @property
    def attendee(self):
        ret = []
        presenters = [item.to_object for item in self.event.presenters]
        for attendee in presenters or []:
            att = icalendar.prop.vCalAddress(attendee.title)
            att.params["cn"] = icalendar.prop.vText(attendee.title)
            att.params["ROLE"] = icalendar.prop.vText("REQ-PARTICIPANT")
            ret.append(att)
        return {"value": ret}

    @property
    def contact(self):
        cn = []
        return {"value": ", ".join(cn)}

    @property
    def categories(self):
        ret = []
        for cat in self.event.subjects or []:
            ret.append(cat)
        if ret:
            return {"value": ret}

    @property
    def geo(self):
        """Not implemented."""
        # HARDCODED
        return {"value": (-15.809682071122648, -47.90939080343629)}

    def ical_add(self, prop, val):
        if not val:
            return

        if not isinstance(val, list):
            val = [val]

        for _val in val:
            assert isinstance(_val, dict)
            value = _val["value"]
            if not value:
                continue
            prop = _val.get("property", prop)
            params = _val.get("parameters", None)
            self.ical.add(prop, value, params)

    def to_ical(self, vocabs: dict):
        self.vocabs = vocabs
        ical_add = self.ical_add
        ical_add("dtstamp", self.dtstamp)
        ical_add("created", self.created)
        ical_add("last-modified", self.last_modified)
        ical_add("uid", self.uid)
        ical_add("url", self.url)
        ical_add("summary", self.summary)
        ical_add("description", self.description)
        ical_add("dtstart", self.dtstart)
        ical_add("dtend", self.dtend)
        ical_add(None, self.recurrence)  # property key set via val
        ical_add("location", self.location)
        ical_add("attendee", self.attendee)
        ical_add("contact", self.contact)
        ical_add("categories", self.categories)
        ical_add("geo", self.geo)

        return self.ical


class SessionICal(BrowserView):
    """Returns events in iCal format."""

    @property
    def user(self):
        if not api.user.is_anonymous():
            return api.user.get_current()

    @property
    def calendar_filename(self):
        return f"{self.context.getId()}.ics"

    def get_events(self) -> list:
        return [aq_inner(self.context)]

    def get_ical_string(self):
        events = self.get_events()
        cal = construct_icalendar(self.context, events)
        return cal.to_ical()

    def __call__(self):
        ical = self.get_ical_string()
        self.request.response.setHeader("Content-Type", "text/calendar")
        self.request.response.setHeader(
            "Content-Disposition", f'attachment; filename="{self.calendar_filename}"'
        )
        self.request.response.setHeader("Content-Length", len(ical))
        self.request.response.write(ical)


class MyScheduleICal(SessionICal):
    """Returns my schedule events in iCal format."""

    @property
    def calendar_filename(self):
        user_id = self.user.getId()
        return f"ploneconf2024-{user_id}.ics"

    def get_events(self) -> list:
        bookmarks_api = SessionBookmarks()
        user = self.user
        user_id = user.getId()
        bookmarks = bookmarks_api.all_by_user_id(user_id)
        my_slots = [item["slot_id"] for item in bookmarks]
        brains = api.content.find(
            context=api.portal.get(),
            UID=my_slots,
            object_provides=IScheduleSlot,
            review_state="published",
            sort_on="start",
            sort_order="ascending",
        )
        events = [aq_inner(brain.getObject()) for brain in brains]
        return events

    def __call__(self):
        user = self.user
        if user:
            return super().__call__()
