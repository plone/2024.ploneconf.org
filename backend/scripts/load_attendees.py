from pathlib import Path
from plone.restapi.serializer.converters import datetimelike_to_iso
from ploneconf.eventbrite import utils

import json
import logging
import os
import requests
import string


# Setup logging
logging.basicConfig()
logger = logging.getLogger("ploneconf.load_attendees")
logger.setLevel(logging.INFO)

CURRENT_FOLDER = Path(__file__).parent.resolve()
DATA_FOLDER = CURRENT_FOLDER / "data"
PASS_LEN = 12
PASS_CHARS = string.ascii_lowercase + string.hexdigits + "#@!"


BASE_URL = os.environ.get("BASE_URL", "http://localhost:8080/Plone/++api++/")
USER = os.environ.get("USER", "admin")
PASSWD = os.environ.get("PASSWD", "admin")
BASIC_AUTH = os.environ.get("BASIC_AUTH")
SHOULD_CREATE = bool(os.environ.get("SHOULD_CREATE"))
SHOULD_PUBLISH = bool(os.environ.get("SHOULD_PUBLISH"))
SHOULD_UPDATE = bool(os.environ.get("SHOULD_UPDATE"))

if not BASE_URL:
    raise RuntimeError("BASE_URL not set")

headers = {"Accept": "application/json"}

session = requests.Session()
session.headers.update(headers)
if BASIC_AUTH:
    session.auth = tuple(BASIC_AUTH.split("|"))

headers = {"Accept": "application/json"}

# Authenticate user
login_url = f"{BASE_URL}/@login"
response = session.post(login_url, json={"login": USER, "password": PASSWD})
data = response.json()
token = data["token"]
if BASIC_AUTH:
    session.cookies.set("auth_token", token)
else:
    session.headers.update({"Authorization": f"Bearer {token}"})


def prepare_attendees(raw_data: list) -> dict:
    contents = {}
    for attendee in raw_data:
        item = utils._attendee_to_plone_type(attendee)
        payload = item["payload"]
        payload["@type"] = payload.pop("type")
        for key in ("creation_date", "order_date"):
            payload[key] = datetimelike_to_iso(payload[key])
        site_path = f"/attendees/{item['id']}"
        contents[site_path] = item
    return contents


def create(contents: dict):
    # Create content
    for path, data in contents.items():
        payload = data["payload"]
        transitions = data["transitions"]
        url = f"{BASE_URL}{path}"
        parent_path = "/".join(path.split("/")[:-1])[1:]
        response = session.get(url, allow_redirects=False)
        if response.status_code in (302, 404):
            response = session.post(f"{BASE_URL}/{parent_path}", json=payload)
            if response.status_code > 300:
                breakpoint()
                logger.error(f"Error creating '{path}': {response.status_code}")
                continue
            else:
                type_ = payload["@type"]
                email = payload["email"]
                password = payload["password"]
                if type_ in ("Attendee", "OnlineAttendee"):
                    logger.info(f"Content created: {path},{type_},{email},{password}")
        else:
            type_ = payload["@type"]
            email = payload["email"]
            password = payload["password"]
            if type_ in ("Attendee", "OnlineAttendee"):
                logger.info(f"Content exists: {path},{type_},{email},{password}")
        response_data = response.json()
        current_state = response_data["review_state"]
        for transition in transitions:
            if current_state not in ["registered"]:
                continue
            endpoint = f"{url}/@workflow/{transition}"
            response = session.post(endpoint, allow_redirects=False)
            status = response.status_code
            logger.info(f"Transitioning: {path} with {transition} (Status: {status})")


def show(contents: dict):
    # Create content
    for path, data in contents.items():
        payload = data["payload"]
        type_ = payload["@type"]
        email = payload["email"]
        password = payload["password"]
        logger.info(f"Report: {path},{type_},{email},{password}")


for name, func in (("attendees", prepare_attendees),):
    raw_data = json.loads((DATA_FOLDER / f"{name}.json").read_text())
    data = func(raw_data)
    if SHOULD_CREATE:
        create(data)
    else:
        show(data)
