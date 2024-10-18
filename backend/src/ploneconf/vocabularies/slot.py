from ploneconf import _
from zope.interface import provider
from zope.schema.interfaces import IVocabularyFactory
from zope.schema.vocabulary import SimpleTerm
from zope.schema.vocabulary import SimpleVocabulary


ROOMS = (
    ("auditorio-1", _("Jean Ferri Auditorium")),
    ("auditorio-2", _("Dorneles Treméa Auditorium")),
    ("sala-2", _("Capibara Room")),
    ("sala-juri", _("Jaguatirica Room")),
    ("401", _("Buriti Room")),
    ("402", _("Ipê Room")),
)


@provider(IVocabularyFactory)
def slot_rooms(context):
    """Available Slot Rooms."""
    terms = []
    for token, title in ROOMS:
        terms.append(SimpleTerm(token, token, title))
    return SimpleVocabulary(terms)


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
