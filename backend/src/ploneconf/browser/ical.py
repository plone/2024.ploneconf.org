from Acquisition import aq_inner
from datetime import datetime
from plone import api
from plone.app.event.base import default_timezone
from plone.app.event.ical.exporter import add_to_zones_map
from plone.event.interfaces import IICalendarEventComponent
from plone.event.utils import utc
from zope.interface import implementer
from zope.publisher.browser import BrowserView

import icalendar
import pytz


PRODID = "-//Plone.org//NONSGML plone.app.event//EN"
VERSION = "2.0"


def construct_icalendar(context):
    """Returns an icalendar.Calendar object.

    :param context: A content object, which is used for calendar details like
                    Title and Description. Usually a container, collection or
                    the event itself.
    """
    cal = icalendar.Calendar()
    cal.add("prodid", PRODID)
    cal.add("version", VERSION)

    cal_tz = default_timezone(context)
    if cal_tz:
        cal.add("x-wr-timezone", cal_tz)

    tzmap = {}
    events = [context]
    for event in events:
        tz = api.portal.get_registry_record("plone.portal_timezone")
        tz_start = tz_end = tz
        tzmap = add_to_zones_map(tzmap, tz_start, context.start)
        tzmap = add_to_zones_map(tzmap, tz_end, context.end)
        cal.add_component(IICalendarEventComponent(event).to_ical())

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
        return {"value": self.event.absolute_url()}

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
        return

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

    def to_ical(self):
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

    def get_ical_string(self):
        cal = construct_icalendar(aq_inner(self.context))
        return cal.to_ical()

    def __call__(self):
        ical = self.get_ical_string()
        name = f"{self.context.getId()}.ics"
        self.request.response.setHeader("Content-Type", "text/calendar")
        self.request.response.setHeader(
            "Content-Disposition", f'attachment; filename="{name}"'
        )
        self.request.response.setHeader("Content-Length", len(ical))
        self.request.response.write(ical)
