from plone import api
from plone.restapi.testing import RelativeSession

import pytest



ENDPOINT = "/en/@sponsors"


@pytest.fixture
def portal(functional):
    return functional["portal"]


@pytest.fixture
def api_session(portal):
    base_url = portal.absolute_url()
    session = RelativeSession(base_url)
    session.headers.update({"Accept": "application/json"})
    return session


class TestSponsorsServiceEn:
    def test_get_sponsors_as_anonymous(self, api_session):
        response = api_session.get(ENDPOINT)
        assert response.status_code == 200

    def test_get_sponsors_levels(self, api_session):
        response = api_session.get(ENDPOINT)
        payload = response.json()
        assert len(payload["levels"]) == 3

    # Considering data from import
    @pytest.mark.parametrize(
        "name,idx,total",
        [
            ["platinum", 0, 1],
            ["bronze", 1, 2],
            ["organizer", 2, 6],
        ],
    )
    def test_get_sponsors_values(self, api_session, name, idx, total):
        response = api_session.get(ENDPOINT)
        payload = response.json()
        level = payload["levels"][idx]
        assert level["id"] == name
        assert len(level["items"]) == total
