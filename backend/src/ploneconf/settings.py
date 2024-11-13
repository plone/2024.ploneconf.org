import os


EVENTBRITE_BASE_URL = os.environ.get(
    "EVENTBRITE_BASE_URL", "https://www.eventbriteapi.com/v3"
)
EVENTBRITE_KEY = os.environ.get("EVENTBRITE_KEY", "")
EVENTBRITE_ORG_ID = os.environ.get("EVENTBRITE_ORG_ID", "")
EVENTBRITE_EVENT_ID = os.environ.get("EVENTBRITE_EVENT_ID", "")

AUTHENTICATED_GROUP = "AuthenticatedUsers"
ADMIN_GROUP = "Administrators"
EDITORS_GROUP = "Site Administrators"
ORGANIZERS_CORE_GROUP = "organizers-core"

GROUPS = {
    "attendees": {
        "groupname": "attendees",
        "title": "Attendees",
        "description": "Conference Attendees",
        "roles": [],
    },
    "onlineattendees": {
        "groupname": "onlineattendees",
        "title": "Online Attendees",
        "description": "Virtual Conference Attendees",
        "roles": [],
    },
    "presenters": {
        "groupname": "presenters",
        "title": "Presenters",
        "description": "Conference Presenters",
        "roles": [],
        "groups": ["attendees"],
    },
    "sponsors": {
        "groupname": "sponsors",
        "title": "Sponsors",
        "description": "Conference Sponsors",
        "roles": [],
        "groups": [],
    },
    "organizers": {
        "groupname": "organizers",
        "title": "Organizers",
        "description": "Conference Organizers",
        "roles": ["Member"],
    },
    "organizers-core": {
        "groupname": "organizers-core",
        "title": "Organizers Core",
        "description": "Core team",
        "roles": ["Member"],
        "groups": ["organizers", ADMIN_GROUP, EDITORS_GROUP],
    },
    "organizers-frontdesk": {
        "groupname": "organizers-frontdesk",
        "title": "Organizers Frontdesk",
        "description": "Frontdesk",
        "roles": ["Member"],
        "groups": ["organizers"],
    },
}

USER_CATEGORIES = {
    "1504840019": ["attendees"],  # Early Bird / Lote I
    "1577134799": ["attendees"],  # Regular tickets / Lote II
    "1577135609": ["attendees", "sponsors"],  # Sponsors
    "1577135909": ["onlineattendees"],  # Online
    "1577140909": ["organizers", "organizers-frontdesk"],  # Organizers
    "1701094929": ["attendees", "presenters"],  # Speakers
    "1714513069": ["attendees"],  # Sul Global / Global South
    "1851194313": ["attendees"],  # Empenho
    "1902047603": ["onlineattendees", "sponsors"],  # Sponsors Online
    "Attendee": ["attendees"],
    "OnlineAttendee": ["onlineattendees"],
}

CORE_TEAM = [
    "andreclimaco",
    "andre.climaco@gmail.com",
    "ericof",
    "ericof@gmail.com",
    "fredvd",
    "vandijk@kitconcept.com",
    "jhgouveia",
    "eventbrite@jhgouveia.com",
    "luxcas",
    "luxcas@gmail.com",
    "rafahela",
    "rafahela@gmail.com",
]
