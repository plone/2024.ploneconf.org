from zope.interface import provider
from zope.schema.interfaces import IVocabularyFactory
from zope.schema.vocabulary import SimpleTerm
from zope.schema.vocabulary import SimpleVocabulary


@provider(IVocabularyFactory)
def training_duration(context):
    """Available Training Duration."""
    return SimpleVocabulary(
        [
            SimpleTerm(value="HalfDay", title="1/2 day"),
            SimpleTerm(value="OneDay", title="1 day"),
            SimpleTerm(value="TwoDay", title="2 day"),
        ]
    )
