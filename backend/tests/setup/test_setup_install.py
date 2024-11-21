from ploneconf import PACKAGE_NAME

import pytest


class TestSetupInstall:
    def test_addon_installed(self, installer):
        """Test if ploneconf is installed."""
        assert installer.is_product_installed(PACKAGE_NAME) is True

    def test_browserlayer(self, browser_layers):
        """Test that IPloneconfLayer is registered."""
        from ploneconf.interfaces import IPloneconfLayer

        assert IPloneconfLayer in browser_layers

    def test_latest_version(self, profile_last_version):
        """Test latest version of default profile."""
        assert profile_last_version(f"{PACKAGE_NAME}:default") == "20241121001"

    @pytest.mark.parametrize(
        "profile",
        [
            "plone.volto:default",
            "plone.app.multilingual:default",
            "collective.volto.formsupport:default",
            "pas.plugins.authomatic:default",
            "Products.membrane:default",
        ],
    )
    def test_dependency_installed(self, installer, profile):
        """Test dependency profile is installed."""
        assert installer.is_profile_installed(profile) is True
