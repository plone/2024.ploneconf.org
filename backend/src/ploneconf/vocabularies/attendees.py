from plone.app.vocabularies.catalog import StaticCatalogVocabulary
from ploneconf import _
from zope.interface import provider
from zope.schema.interfaces import IVocabularyFactory
from zope.schema.vocabulary import SimpleTerm
from zope.schema.vocabulary import SimpleVocabulary


TYPES = {
    "Attendee": _("Attendee"),
    "OnlineAttendee": _("Online Attendee"),
}


@provider(IVocabularyFactory)
def attendee_types(context):
    """Types of attendees."""
    terms = []
    for token, title in TYPES.items():
        terms.append(SimpleTerm(token, token, title))
    return SimpleVocabulary(terms)


STATES = {
    "registered": _("Registered"),
    "checked": _("Checked-In"),
    "cancelled": _("Cancelled"),
    "refunded": _("Refunded"),
}


@provider(IVocabularyFactory)
def attendee_states(context):
    """States of attendees workflow."""
    terms = []
    for token, title in STATES.items():
        terms.append(SimpleTerm(token, token, title))
    return SimpleVocabulary(terms)


CATEGORIES = {
    "attendees": _("Attendees"),
    "onlineattendees": _("Online Attendees"),
    "presenters": _("Presenters"),
    "sponsors": _("Sponsors"),
    "organizers": _("Organizers"),
    "organizers-core": _("Organizers (Core)"),
    "organizers-frontdesk": _("Organizers (Frontdesk)"),
    "djangogirls": _("Django Girls"),
}


@provider(IVocabularyFactory)
def attendee_categories(context):
    """Categories of attendees."""
    terms = []
    for token, title in CATEGORIES.items():
        terms.append(SimpleTerm(token, token, title))
    return SimpleVocabulary(terms)


@provider(IVocabularyFactory)
def attendees_vocab(context) -> StaticCatalogVocabulary:
    """Attendees."""
    return StaticCatalogVocabulary(
        {
            "portal_type": ["Attendee"],
            "sort_on": "sortable_title",
            "review_state": ["registered", "checked"],
        }
    )
