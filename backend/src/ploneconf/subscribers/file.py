from Acquisition import aq_parent
from ploneconf import logger
from ploneconf.users.content.attendee import Attendee


def check_certificate_permission(obj, _event):
    """After mo."""
    parent = aq_parent(obj)
    if not isinstance(parent, Attendee):
        return

    obj.manage_permission("View", roles=["Anonymous"], acquire=False)
    logger.info(f"Changed permission for {obj.absolute_url()}")
