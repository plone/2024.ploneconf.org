from plone import api
from plone.protect.interfaces import IDisableCSRFProtection
from plone.restapi.services import Service
from ploneconf import eventbrite
from zope.interface import alsoProvides


class Get(Service):
    """Sync eventbrite."""

    def reply(self) -> dict:
        alsoProvides(self.request, IDisableCSRFProtection)
        portal_url = api.portal.get().absolute_url()
        report = eventbrite.sync()
        return {
            "@id": f"{portal_url}/@eventbrite-sync",
            "report": report,
        }
