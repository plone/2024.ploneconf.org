from plone import api
from plone.restapi.interfaces import ISerializeToJsonSummary
from plone.restapi.services import Service
from ploneconf.behaviors.schedule import IScheduleSlot
from typing import Any
from zope.component import getMultiAdapter


def group_slots(slots: list[dict]) -> list[dict]:
    response = []
    days = {}
    rooms = {}
    for slot in slots:
        start = slot.get("start", "")
        if not start:
            continue
        room = slot.get("room")
        if room and room[0]["token"] not in rooms:
            rooms[room[0]["token"]] = room
        day = start[0:10]
        if day not in days:
            days[day] = {"items": [], "id": day}
        day_info = days[day]
        day_info["items"].append(slot)
    for day in days.values():
        day_rooms = set()
        for item in day["items"]:
            room = item.get("room") or rooms["auditorio-1"]
            day_rooms.add(room[0]["token"])
        day["rooms"] = sorted(list(day_rooms))
        response.append(day)
    return response


class StreamGet(Service):
    def _serialize_brain(self, brain) -> dict[str, Any]:
        obj = brain.getObject()
        result = getMultiAdapter((obj, self.request), ISerializeToJsonSummary)()
        result["stream_url"] = obj.stream_url
        result["studio_url"] = obj.studio_url
        return result

    def get_slots(self, room: str = "") -> list[dict[str, Any]]:
        portal = api.portal.get()
        payload = {
            "context": portal,
            "object_provides": IScheduleSlot,
            "has_stream": True,
            "review_state": "published",
            "sort_on": "start",
            "sort_order": "ascending",
        }
        if room:
            payload["room"] = room
        results = api.content.find(**payload)
        return [self._serialize_brain(brain) for brain in results]

    def reply(self) -> list[dict]:
        room = self.request.form.get("room", "")
        if not room:
            room = self.context.id
        # today = bool(self.request.form.get("today"))
        raw_slots = self.get_slots(room=room)
        slots = group_slots(raw_slots)
        return {"items": slots, "total": len(raw_slots)}
