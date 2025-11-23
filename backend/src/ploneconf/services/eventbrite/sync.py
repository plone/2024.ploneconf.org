from plone import api
from plone.protect.interfaces import IDisableCSRFProtection
from plone.restapi.services import Service
from ploneconf import eventbrite
from zope.interface import alsoProvides


class Get(Service):
    """Sync eventbrite."""

    def reply(self) -> dict:
        alsoProvides(self.request, IDisableCSRFProtection)
        changed_since = self.request.form.get("changed_since", None)
        portal_url = api.portal.get().absolute_url()
        report = eventbrite.sync(changed_since)
        return {
            "@id": f"{portal_url}/@eventbrite-sync",
            "report": report,
        }
