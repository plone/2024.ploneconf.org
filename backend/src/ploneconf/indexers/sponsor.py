from Acquisition import aq_parent
from plone.indexer.decorator import indexer
from ploneconf.content.sponsors.sponsor import ISponsor
from ploneconf.content.sponsors.sponsor import Sponsor


@indexer(ISponsor)
def level_indexer(sponsor: Sponsor):
    """Indexer used to store the level of the sponsor."""
    parent = aq_parent(sponsor)
    level = parent.id
    return level
