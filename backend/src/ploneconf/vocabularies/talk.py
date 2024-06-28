from zope.interface import provider
from zope.schema.interfaces import IVocabularyFactory
from zope.schema.vocabulary import SimpleTerm
from zope.schema.vocabulary import SimpleVocabulary


@provider(IVocabularyFactory)
def talk_duration(context):
    """Available Talk Duration."""
    return SimpleVocabulary(
        [
            SimpleTerm(value="LongTalk", title="Long Talk"),
            SimpleTerm(value="ShortTalk", title="Short Talk"),
        ]
    )
