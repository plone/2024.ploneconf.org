from plone.app.event.base import default_timezone
from plone.app.event.dx.behaviors import StartBeforeEnd
from plone.app.z3cform.widget import DatetimeFieldWidget
from plone.autoform import directives
from plone.autoform.interfaces import IFormFieldProvider
from plone.supermodel import model
from ploneconf import _
from zope import schema
from zope.interface import invariant
from zope.interface import provider


@provider(IFormFieldProvider)
class IScheduleSlot(model.Schema):
    """Plone Conference Schedule."""

    model.fieldset(
        "schedule",
        label=_("Schedule"),
        fields=["start", "end", "track"],
    )

    start = schema.Datetime(title=_("Start time"), required=False)
    directives.widget(
        "start",
        DatetimeFieldWidget,
        default_timezone=default_timezone,
        klass="event_start",
    )

    end = schema.Datetime(title=_("End time"), required=False)
    directives.widget(
        "end", DatetimeFieldWidget, default_timezone=default_timezone, klass="event_end"
    )

    @invariant
    def validate_start_end(data):
        if data.start and data.end and data.start > data.end:
            raise StartBeforeEnd(_("End time must be after start time."))

    track = schema.Set(
        title=_("Track"),
        description=_(""),
        value_type=schema.Choice(
            vocabulary="ploneconf.vocabularies.slot_tracks",
        ),
        required=False,
    )
