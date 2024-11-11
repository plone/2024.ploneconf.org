from plone import api
from plone.protect.interfaces import IDisableCSRFProtection
from plone.restapi.interfaces import IExpandableElement
from plone.restapi.services import Service
from ploneconf import logger
from ploneconf.behaviors.schedule import IScheduleSlot
from ploneconf.souper.access import SessionBookmarks
from zope.component import adapter
from zope.interface import alsoProvides
from zope.interface import implementer
from zope.interface import Interface


class BaseService(Service):
    def __init__(self, context, request):
        self.context = context
        self.request = request
        self.api = SessionBookmarks()

    @property
    def user_id(self):
        is_anonymous = api.user.is_anonymous()
        user = api.user.get_current()
        return None if is_anonymous else user.getUserId()

    @property
    def session_id(self):
        return api.content.get_uuid(self.context)

    def get_bookmark(self) -> None | dict:
        user_id = self.user_id
        if user_id:
            return self.api.get(self.user_id, self.session_id)


@implementer(IExpandableElement)
@adapter(IScheduleSlot, Interface)
class GetBookmark(BaseService):
    def __call__(self, expand=False):
        result = {"bookmark": {"@id": f"{self.context.absolute_url()}/@bookmark"}}
        if not expand:
            return result
        bookmark = self.get_bookmark()
        result = {"bookmark": True if bookmark else False}
        return result


class Get(BaseService):
    def reply(self):
        """Check if we have a bookmark"""
        bookmark = GetBookmark(self.context, self.request)
        return bookmark(expand=True)


class Add(BaseService):
    def reply(self):
        """Add slot bookmark"""
        alsoProvides(self.request, IDisableCSRFProtection)
        bookmark = self.get_bookmark()
        if not bookmark:
            bookmark = self.api.add(self.user_id, self.session_id)
        return {"bookmark": True if bookmark else False}


class Delete(BaseService):
    def reply(self):
        """Delete slot bookmark"""
        alsoProvides(self.request, IDisableCSRFProtection)
        bookmark = self.get_bookmark()
        if bookmark:
            status = self.api.delete(self.user_id, self.session_id)
            logger.debug(f"{self.user_id} - {self.session_id} - {status}")
        bookmark = self.get_bookmark()
        return {"bookmark": True if bookmark else False}
