from persistent.dict import PersistentDict
from plone.indexer.decorator import indexer
from ploneconf.behaviors.links import ILinkInformation
from ploneconf.utils import generate_links_dict


@indexer(ILinkInformation)
def links_indexer(obj):
    """Indexer used to store in metadata the links of the object."""
    links = generate_links_dict(obj)
    return PersistentDict(links)
