from plone import api
from plone.protect.interfaces import IDisableCSRFProtection
from plone.restapi.deserializer import json_body
from plone.restapi.interfaces import IExpandableElement
from plone.restapi.interfaces import ISerializeToJsonSummary
from plone.restapi.services import Service
from ploneconf import logger
from ploneconf.content.training import ITraining
from ploneconf.souper.access import TrainingRegistrations
from zope.component import adapter
from zope.component import getMultiAdapter
from zope.interface import alsoProvides
from zope.interface import implementer
from zope.interface import Interface


class BaseService(Service):
    endpoint: str = "@registration"

    def __init__(self, context, request):
        self.context = context
        self.request = request
        self.api = TrainingRegistrations()

    def _error(self, status, type, message):
        self.request.response.setStatus(status)
        return {"error": {"type": type, "message": message}}

    @property
    def training_id(self):
        return api.content.get_uuid(self.context)

    @property
    def user_id(self):
        user = api.user.get_current()
        return user.getUserId() if user else None

    @property
    def base_url(self) -> str:
        base_url = f"{self.context.absolute_url()}/{self.endpoint}"
        if self.user_id:
            base_url = f"{base_url}/{self.user_id}"
        return base_url

    def _serialize_brain(self, brain) -> dict:
        result = getMultiAdapter((brain, self.request), ISerializeToJsonSummary)()
        return result

    def enrich_registrations(self, registrations: list[dict]) -> list[dict]:
        result = []
        user_ids = [item["user_id"] for item in registrations]
        users = {
            brain.getId: self._serialize_brain(brain)
            for brain in api.content.find(
                portal_type=["Attendee"], id=user_ids, unrestricted=True
            )
        }
        for item in registrations:
            item["user"] = users.get(item["user_id"])
            result.append(item)
        return result

    def get_all_registrations(self) -> list[dict]:
        return [item for item in self.api.users_by_training(self.training_id)]

    def get_registration(self, user_id: str | None = None) -> dict:
        user_id = user_id if user_id else self.user_id
        registration = self.api.get(self.user_id, self.training_id)
        return registration or {}


@implementer(IExpandableElement)
@adapter(ITraining, Interface)
class GetRegistration(BaseService):
    def __call__(self, expand=False):
        result = {"@id": self.base_url}
        if not expand:
            return {"registration": result}
        registration = self.get_registration()
        if registration:
            result.update(registration)
        else:
            result = None
        return {"registration": result}


@implementer(IExpandableElement)
@adapter(ITraining, Interface)
class GetRegistrations(BaseService):
    endpoint: str = "@registrations"

    def __call__(self, expand=False):
        result = {"@id": self.base_url, "items": []}
        if not expand:
            return {"registration": result}
        items = self.get_all_registrations()
        result["items"] = self.enrich_registrations(items)
        return {"registrations": result}


class GetAll(BaseService):
    endpoint: str = "@registrations"

    def reply(self):
        """Return the list of registrations"""
        registrations = GetRegistrations(self.context, self.request)
        return registrations(expand=True)


class Get(BaseService):
    def reply(self):
        """Check if we have a registration"""
        result = {"@id": self.base_url}
        registration = self.get_registration()
        if registration:
            result.update(registration)
            return result
        else:
            return self._error(404, "Not Found", "No registrations for this user")


class Add(BaseService):
    def reply(self):
        """Add registration"""
        alsoProvides(self.request, IDisableCSRFProtection)
        result = {"@id": self.base_url}
        registration = self.get_registration()
        if not registration:
            result.update(self.api.add(self.user_id, self.training_id))
        return result


class Delete(BaseService):
    def reply(self):
        """Delete registration"""
        alsoProvides(self.request, IDisableCSRFProtection)
        registration = self.get_registration()
        if registration:
            status = self.api.delete(self.user_id, self.training_id)
            logger.debug(f"{self.user_id} - {self.training_id} - {status}")
        else:
            return self._error(404, "Not Found", "No registrations for this user")
        return


class Patch(BaseService):
    def reply(self):
        """Update registration"""
        alsoProvides(self.request, IDisableCSRFProtection)
        data = json_body(self.request)
        result = {"@id": self.base_url}
        users = data.get("user_ids", [])
        state = data.get("state")
        if users and state:
            items = self.api.transition_training_users(
                self.training_id, users=users, state=state
            )
            result["items"] = self.enrich_registrations(items)
        return {"registrations": result}
