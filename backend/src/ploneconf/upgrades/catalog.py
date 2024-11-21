from plone import api
from ploneconf import logger
from ploneconf.behaviors.schedule import IScheduleSlot
from Products.GenericSetup.tool import SetupTool


def reindex_slots(setup_tool: SetupTool):
    """Reindex slots."""
    portal = api.portal.get()
    brains = api.content.find(
        context=portal,
        object_provides=IScheduleSlot,
        review_state="published",
        sort_on="start",
        sort_order="ascending",
    )
    for brain in brains:
        session = brain.getObject()
        if session.room:
            session.reindexObject(idxs=["room", "has_stream"])
            logger.info(f"Reindexed {session} room and has_stream catalog indexes")
