from ploneconf.utils import sponsor_levels
from zope.interface import provider
from zope.schema.interfaces import IVocabularyFactory
from zope.schema.vocabulary import SimpleTerm
from zope.schema.vocabulary import SimpleVocabulary


@provider(IVocabularyFactory)
def sponsorship_levels(context):
    """Available Sponsorship Levels."""
    terms = []
    levels = sponsor_levels(context)
    for level_id, level_title, _ in levels:
        terms.append(SimpleTerm(level_id, level_id, level_title))
    return SimpleVocabulary(terms)
