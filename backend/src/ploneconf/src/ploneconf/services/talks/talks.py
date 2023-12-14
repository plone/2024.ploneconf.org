from plone import api
from plone.restapi.interfaces import ISerializeToJsonSummary
from plone.restapi.services import Service
from typing import Any
from typing import Dict
from typing import List
from zope.component import getMultiAdapter


class Get(Service):
    def _serialize_brain(self, brain) -> Dict[str, Any]:
        obj = brain.getObject()
        result = getMultiAdapter((obj, self.request), ISerializeToJsonSummary)()
        if bool(obj.presenters):
            result["presenters"] = [
                {
                    "path": presenter.to_object.absolute_url_path(),
                    "title": presenter.to_object.title,
                }
                for presenter in obj.presenters
            ]
        return result

    def get_talks(self) -> List[Dict[str, Any]]:
        results = api.content.find(
            portal_type="Talk",
            review_state="published",
        ) + api.content.find(
            portal_type="Keynote",
            review_state="published",
        )
        return [self._serialize_brain(brain) for brain in results]

    def reply(self) -> List[Dict]:
        return self.get_talks()
