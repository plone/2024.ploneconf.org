from plone.indexer.decorator import indexer
from ploneconf.behaviors.materials import IConferenceMaterials
from ploneconf.behaviors.schedule import IScheduleSlot


@indexer(IScheduleSlot)
def slot_room(obj) -> list[str]:
    """Indexer used to index room information."""
    start = obj.start
    end = obj.end
    room = obj.room
    if not room and (start and end):
        room = {"auditorio-1"}
    return list(room) if room else []


@indexer(IConferenceMaterials)
def has_stream(obj) -> list[str]:
    """Indexer used to index stream info."""
    stream_url = obj.stream_url
    return bool(stream_url)
