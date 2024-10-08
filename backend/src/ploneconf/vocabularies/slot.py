from ploneconf import _
from zope.interface import provider
from zope.schema.interfaces import IVocabularyFactory
from zope.schema.vocabulary import SimpleTerm
from zope.schema.vocabulary import SimpleVocabulary


@provider(IVocabularyFactory)
def slot_rooms(context):
    """Available Slot Rooms."""
    return SimpleVocabulary(
        [
            SimpleTerm(value="main-room-1", title="Auditorium 1"),
            SimpleTerm(value="main-room-2", title="Auditorium 2"),
            SimpleTerm(value="room-2", title="Room 2"),
            SimpleTerm(value="room-jury", title="Court Room"),
            SimpleTerm(value="room-401", title="401"),
            SimpleTerm(value="room-402", title="402"),
        ]
    )


TRACKS = (
    ("plone-backend", _("Plone: Backend")),
    ("plone-frontend", _("Plone: Frontend")),
    ("plone-devops", _("Plone: DevOps")),
    ("plone-case-study", _("Plone: Case Study")),
    ("python-creative-coding", _("Creative Coding with Python")),
    ("python-web-development", _("Web Development with Python")),
    ("python-for-data-science", _("Python for Data Science")),
    ("python-for-machine-learning-ai", _("Python for Machine Learning / AI")),
    ("python-for-geographic-data-analysis", _("Python for Geographic Data Analysis")),
    ("python-for-devops", _("Python for DevOps")),
    ("python-core", _("Python Core")),
    ("python-in-education", _("Python in Education")),
    ("community-inclusion-diversity", _("Community / Inclusion / Diversity")),
    ("technical-documentation", _("Technical Documentation")),
    ("other", _("Other")),
    ("keynotes", _("Keynotes")),
)


@provider(IVocabularyFactory)
def slot_tracks(context):
    """Available Slot Tracks."""
    terms = []
    for token, title in TRACKS:
        terms.append(SimpleTerm(token, token, title))
    return SimpleVocabulary(terms)


@provider(IVocabularyFactory)
def talk_tracks(context):
    """Available Talk Tracks."""
    terms = []
    for token, title in TRACKS:
        if token == "keynotes":
            continue
        terms.append(SimpleTerm(token, token, title))
    return SimpleVocabulary(terms)


@provider(IVocabularyFactory)
def slot_levels(context):
    """Available Slot Levels."""
    return SimpleVocabulary(
        [
            SimpleTerm(value="beginner", title="Beginner"),
            SimpleTerm(value="intermediate", title="Intermediate"),
            SimpleTerm(value="expert", title="Expert"),
        ]
    )


@provider(IVocabularyFactory)
def slot_audiences(context):
    """Available Slot Audiences."""
    return SimpleVocabulary(
        [
            SimpleTerm(value="user", title="User"),
            SimpleTerm(value="integrator", title="Integrator"),
            SimpleTerm(value="designer", title="Designer"),
            SimpleTerm(value="developer", title="Developer"),
            SimpleTerm(value="sysadmin", title="SysAdmin/Devops"),
        ]
    )
