from Acquisition import aq_parent
from plone.restapi.imaging import get_original_image_url
from plone.restapi.interfaces import ISerializeToJson
from plone.restapi.interfaces import ISerializeToJsonSummary
from plone.restapi.serializer.converters import json_compatible
from plone.restapi.serializer.dxcontent import SerializeToJson
from ploneconf.content.sponsors.sponsor import ISponsor
from ploneconf.utils import generate_links_dict
from zope.component import adapter
from zope.interface import implementer
from zope.interface import Interface


@implementer(ISerializeToJsonSummary)
@adapter(ISponsor, Interface)
class SponsorJSONSummarySerializer:
    """ISerializeToJsonSummary adapter for the Sponsor."""

    def __init__(self, context, request):
        self.context = context
        self.request = request

    def image_serialization(self):
        image = self.context.image
        if not image:
            return None

        width, height = image.getImageSize()

        url = get_original_image_url(self.context, "image", width, height)

        return {
            "filename": image.filename,
            "content-type": image.contentType,
            "size": image.getSize(),
            "download": url,
            "width": width,
            "height": height,
        }

    def __call__(self):
        summary = json_compatible(
            {
                "@id": self.context.absolute_url(),
                "@type": self.context.portal_type,
                "title": self.context.title,
                "description": self.context.description,
                "remoteUrl": self.context.remoteUrl,
                "level": aq_parent(self.context).id,
                "image": self.image_serialization(),
            }
        )
        return summary


@implementer(ISerializeToJson)
@adapter(ISponsor, Interface)
class SponsorJSONSerializer(SerializeToJson):
    def __call__(self, version=None, include_items=True):
        result = super().__call__(version, include_items)
        links = generate_links_dict(self.context)
        result.update(
            json_compatible(
                {
                    "links": links,
                }
            )
        )
        return result
