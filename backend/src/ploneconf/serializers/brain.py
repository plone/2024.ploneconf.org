from plone.restapi.interfaces import ISerializeToJsonSummary
from plone.restapi.serializer.summary import DefaultJSONSummarySerializer
from ploneconf.interfaces import IPloneconfLayer
from Products.ZCatalog.interfaces import ICatalogBrain
from zope.component import adapter
from zope.component import getMultiAdapter
from zope.interface import implementer


@implementer(ISerializeToJsonSummary)
@adapter(ICatalogBrain, IPloneconfLayer)
class JSONSummarySerializer(DefaultJSONSummarySerializer):
    special_portal_types = (
        "Keynote",
        "Person",
        "Training",
        "Talk",
    )

    def __call__(self):
        portal_type = self.context.portal_type
        if portal_type in self.special_portal_types:
            obj = self.context.getObject()
            summary = getMultiAdapter((obj, self.request), ISerializeToJsonSummary)()
        else:
            summary = super().__call__()
        return summary
