from plone import api
from plone.restapi.interfaces import ISerializeToJson
from plone.restapi.interfaces import ISerializeToJsonSummary
from plone.restapi.serializer import user as user_serializer
from ploneconf.interfaces import IPloneconfLayer
from Products.CMFCore.interfaces._tools import IMemberData
from Products.PlonePAS.tools.memberdata import MemberData
from zope.component import adapter
from zope.component import getMultiAdapter
from zope.interface import implementer


def additional_data(request, user: MemberData) -> dict:
    uuid = user.getProperty("uuid")
    additional_info = {
        "@context": "",
    }
    if uuid:
        brains = api.content.find(UID=uuid, unrestricted=True)
        if brains:
            serializer = getMultiAdapter((brains[0], request), ISerializeToJsonSummary)
            data = serializer()
            context = f"{data['@id']}"
            portrait = ""
            scales = data.get("image_scales")
            if scales and scales.get("image"):
                scales = scales.get("image")[0]
                scale = scales.get("mini", scales.get("thumb", scales)) or scales
                portrait = scale.get("download", "")
            additional_info = {
                "@context": context,
                "portrait": f"{context}/{portrait}" if portrait else portrait,
            }
    return additional_info


@implementer(ISerializeToJsonSummary)
@adapter(IMemberData, IPloneconfLayer)
class SerializeUserToJsonSummary(user_serializer.SerializeUserToJsonSummary):
    def __call__(self):
        user = self.context
        data = super().__call__()
        data.update(additional_data(self.request, user))
        return data


@implementer(ISerializeToJson)
@adapter(IMemberData, IPloneconfLayer)
class SerializeUserToJson(user_serializer.SerializeUserToJson):
    def __call__(self):
        user = self.context
        data = super().__call__()
        data.update(additional_data(self.request, user))
        return data
