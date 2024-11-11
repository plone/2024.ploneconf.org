from repoze.catalog.catalog import Catalog
from repoze.catalog.indexes.field import CatalogFieldIndex
from souper.interfaces import ICatalogFactory
from souper.soup import NodeAttributeIndexer
from souper.soup import Record
from zope.interface import implementer


@implementer(ICatalogFactory)
class UserTrackingCatalogFactory:
    def __call__(self, context: Record | None = None) -> Catalog:
        catalog = Catalog()
        catalog["uid"] = CatalogFieldIndex(NodeAttributeIndexer("uid"))
        catalog["created"] = CatalogFieldIndex(NodeAttributeIndexer("created"))
        catalog["user_id"] = CatalogFieldIndex(NodeAttributeIndexer("user_id"))
        catalog["action"] = CatalogFieldIndex(NodeAttributeIndexer("action"))
        return catalog


@implementer(ICatalogFactory)
class SessionBookmarksCatalogFactory:
    def __call__(self, context: Record | None = None) -> Catalog:
        catalog = Catalog()
        catalog["uid"] = CatalogFieldIndex(NodeAttributeIndexer("uid"))
        catalog["created"] = CatalogFieldIndex(NodeAttributeIndexer("created"))
        catalog["user_id"] = CatalogFieldIndex(NodeAttributeIndexer("user_id"))
        catalog["slot_id"] = CatalogFieldIndex(NodeAttributeIndexer("slot_id"))
        return catalog


@implementer(ICatalogFactory)
class TrainingRegistrationsCatalogFactory:
    def __call__(self, context: Record | None = None) -> Catalog:
        catalog = Catalog()
        catalog["uid"] = CatalogFieldIndex(NodeAttributeIndexer("uid"))
        catalog["created"] = CatalogFieldIndex(NodeAttributeIndexer("created"))
        catalog["user_id"] = CatalogFieldIndex(NodeAttributeIndexer("user_id"))
        catalog["training_id"] = CatalogFieldIndex(NodeAttributeIndexer("training_id"))
        catalog["state"] = CatalogFieldIndex(NodeAttributeIndexer("state"))
        return catalog
