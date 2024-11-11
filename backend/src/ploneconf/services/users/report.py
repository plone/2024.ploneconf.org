from plone import api
from plone.restapi.services import Service
from ploneconf.souper.access import Tracking
from zope.interface import implementer
from zope.publisher.interfaces import IPublishTraverse


@implementer(IPublishTraverse)
class TrackingGet(Service):
    def __init__(self, context, request):
        self.context = context
        self.request = request
        self.path_params = []

    def _error(self, status, type, message):
        self.request.response.setStatus(status)
        return {"error": {"type": type, "message": message}}

    def publishTraverse(self, request, name):
        # Consume any path segments as parameters
        self.path_params.append(name)
        return self

    def get_records(self, user_id: str) -> list[dict]:
        tracking = Tracking()
        records = tracking.get(user_id)
        return [record for record in records]

    def reply(self) -> list[dict]:
        if len(self.path_params) != 1:
            return self._error(404, "Not Found", "No user informed")
        user_id = self.path_params[-1]
        portal_url = api.portal.get().absolute_url()
        records = self.get_records(user_id)
        return {"@id": f"{portal_url}/@users-report/{user_id}", "items": records}
