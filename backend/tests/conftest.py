from plone.app.testing import SITE_OWNER_NAME
from plone.app.testing import SITE_OWNER_PASSWORD
from plone.testing.z2 import Browser
from ploneconf.testing import FUNCTIONAL_TESTING
from ploneconf.testing import INTEGRATION_TESTING
from pytest_plone import fixtures_factory

import pytest


pytest_plugins = ["pytest_plone"]


globals().update(
    fixtures_factory(
        (
            (FUNCTIONAL_TESTING, "functional"),
            (INTEGRATION_TESTING, "integration"),
        )
    )
)


@pytest.fixture
def browser(integration):
    browser = Browser(integration["app"])
    browser.handleErrors = False
    return browser


@pytest.fixture
def browser_auth(browser):
    browser.addHeader(
        "Authorization",
        f"Basic {SITE_OWNER_NAME}:{SITE_OWNER_PASSWORD}",
    )
    return browser
