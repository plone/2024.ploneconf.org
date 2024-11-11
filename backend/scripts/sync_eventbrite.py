import logging
import os
import requests


# Setup logging
logging.basicConfig()
logger = logging.getLogger("ploneconf.site_sync_eventbrite")
logger.setLevel(logging.INFO)

BASE_URL = os.environ.get("BASE_URL", "http://localhost:8080/Plone/++api++")
USER = os.environ.get("USER", "admin")
PASSWD = os.environ.get("PASSWD", "admin")
BASIC_AUTH = os.environ.get("BASIC_AUTH")


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


def do_sync():
    url = f"{BASE_URL}/@eventbrite-sync"
    response = session.get(url, allow_redirects=False)
    data = response.json()
    logger.info(data)


do_sync()
