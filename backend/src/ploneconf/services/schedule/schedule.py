from copy import deepcopy
from datetime import timedelta
from dateutil.parser import parse
from plone import api
from plone.restapi.interfaces import ISerializeToJsonSummary
from plone.restapi.services import Service
from ploneconf.behaviors.schedule import IScheduleSlot
from typing import Any
from typing import Dict
from typing import List
from zope.component import getMultiAdapter


def dict_as_sorted_list(data: dict) -> list[dict]:
    keys = sorted(data.keys())
    response = []
    for key in keys:
        response.append({"id": key, "items": data[key]})
    return response


def process_trainings(slots: list[dict]) -> list[dict]:
    """Break whole day training sessions as 2 slots."""
    response = []
    for slot in slots:
        raw_start = slot["start"]
        raw_end = slot["end"]
        if slot.get("@type") != "Training" or not (raw_start and raw_end):
            response.append(slot)
            continue
        start = parse(raw_start)
        end = parse(raw_end)
        if (end - start).seconds > 14400:
            # change the first slot end
            new_end = (start + timedelta(seconds=14400)).isoformat()
            slot["end"] = new_end
            response.append(slot)
            slot = deepcopy(slot)
            # change the second slot start
            new_start = (end - timedelta(seconds=14400)).isoformat()
            slot["start"] = new_start
            slot["end"] = raw_end
            response.append(slot)
        else:
            response.append(slot)
    return response


def group_slots(slots: list[dict]) -> list[dict]:
    response = []
    days = {}
    slots = process_trainings(slots)
    for slot in slots:
        start = slot.get("start", "")
        if not start:
            continue
        day = start[0:10]
        hour = start
        room = slot["room"][0]["token"] if slot.get("room") else "_all_"
        if day not in days:
            days[day] = {}
        day_info = days[day]
        if hour not in day_info:
            day_info[hour] = {}
        day_info[hour][room] = slot
    response = dict_as_sorted_list(days)
    for day in response:
        rooms = set()
        day["items"] = dict_as_sorted_list(day.get("items"))
        for hour in day["items"]:
            types = set()
            for room in hour["items"]:
                rooms.add(room)
                for slot in hour["items"].values():
                    slot_category = slot.get("slot_category")
                    if not slot_category:
                        slot_category = slot.get("@type")
                    types.add(slot_category)
            hour["types"] = list(types)
        day["rooms"] = sorted(list(rooms))
    return response


class Get(Service):
    def _serialize_brain(self, brain) -> Dict[str, Any]:
        obj = brain.getObject()
        result = getMultiAdapter((obj, self.request), ISerializeToJsonSummary)()
        return result

    def get_slots(self) -> List[Dict[str, Any]]:
        results = api.content.find(
            object_provides=IScheduleSlot,
            review_state="published",
            sort_on="start",
            sort_order="ascending",
        )
        return [self._serialize_brain(brain) for brain in results]

    def reply(self) -> List[Dict]:
        raw_slots = self.get_slots()
        slots = group_slots(raw_slots)
        return {"items": slots}
