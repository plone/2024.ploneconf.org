from zope.interface import provider
from zope.schema.interfaces import IVocabularyFactory
from zope.schema.vocabulary import SimpleTerm
from zope.schema.vocabulary import SimpleVocabulary


@provider(IVocabularyFactory)
def slot_tracks(context):
    """Available Slot Tracks."""
    return SimpleVocabulary(
        [
            SimpleTerm(value="track-1", title="Track 1"),
            SimpleTerm(value="track-2", title="Track 2"),
            SimpleTerm(value="track-3", title="Track 3"),
        ]
    )


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
