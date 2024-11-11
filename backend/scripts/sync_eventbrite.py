from pathlib import Path

import json
import logging
import os
import requests


# Setup logging
logging.basicConfig()
logger = logging.getLogger("ploneconf.sync_eventbrite")
logger.setLevel(logging.INFO)

CURRENT_FOLDER = Path(__file__).parent.resolve()
DATA_FOLDER = CURRENT_FOLDER / "data"

BASE_URL = os.environ.get("EVENTBRITE_BASE_URL", "https://www.eventbriteapi.com/v3")
EVENTBRITE_KEY = os.environ.get("EVENTBRITE_KEY", "")
EVENTBRITE_ORG_ID = os.environ.get("EVENTBRITE_ORG_ID", "")
EVENTBRITE_EVENT_ID = os.environ.get("EVENTBRITE_EVENT_ID", "")

if not (EVENTBRITE_KEY and EVENTBRITE_EVENT_ID and EVENTBRITE_ORG_ID):
    raise RuntimeError(
        "Please set EVENTBRITE_KEY, EVENTBRITE_EVENT_ID and EVENTBRITE_ORG_ID"
    )

organization_id = EVENTBRITE_ORG_ID
event_id = EVENTBRITE_EVENT_ID

headers = {"Authorization": f"Bearer {EVENTBRITE_KEY}"}
SERVICES = [
    ("discounts", "discounts.json", "org"),
    ("ticket_classes", "ticket_classes.json", "event"),
    ("attendees", "attendees.json", "event"),
]


def dump_data(endpoint, cat, fh):
    logger.info(f"Processing {endpoint}")
    params = ""
    if cat == "event":
        base_url = f"{BASE_URL}/events/{event_id}/{endpoint}/"
    else:
        params = "?scope=event&event_id={event_id}&page_size=300"
        base_url = f"{BASE_URL}/organizations/{organization_id}/{endpoint}"
    base_url = f"{base_url}{params}"
    response = requests.get(base_url, headers=headers)
    data = response.json()
    continuation = data.get("pagination", {}).get("continuation", "")
    items = data[endpoint]
    while continuation:
        print(len(items), continuation)
        response = requests.get(
            f"{base_url}?continuation={continuation}", headers=headers
        )
        data = response.json()
        continuation = data.get("pagination", {}).get("continuation", "")
        items.extend(data.get(endpoint, []))

    fh.write_text(json.dumps(items, indent=2))
    logger.info(f"- Wrote {len(items)} to {fh}")


for endpoint, filename, cat in SERVICES:
    fh = Path(f"{DATA_FOLDER}/{filename}")
    dump_data(endpoint, cat, fh)
