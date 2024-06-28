from plone import api
from plone.app.multilingual.setuphandlers import enable_translatable_behavior
from plone.app.multilingual.setuphandlers import init_pam
from ploneconf import logger
from ploneconf.exportimport import helpers
from ploneconf.setuphandlers.blocks import process_blocks
from Products.CMFPlone.interfaces import INonInstallable
from Products.GenericSetup.tool import SetupTool
from zope.interface import implementer


@implementer(INonInstallable)
class HiddenProfiles:
    def getNonInstallableProfiles(self):
        """Hide uninstall profile from site-creation and quickinstaller."""
        return [
            "ploneconf:uninstall",
        ]


def populate_portal(setup_tool: SetupTool):
    """Post install script"""
    portal = api.portal.get()
    logger.info(f"Site created {portal.absolute_url()}")
    init_pam(setup_tool)
    enable_translatable_behavior(portal)
    logger.info("- Multilingual setup")
    # Import content
    directory = helpers.export_dir()
    request = setup_tool.REQUEST
    import_view = api.content.get_view("import_all", portal, request=request)
    import_view(path=directory)
    # Fix blocks' images
    with api.env.adopt_roles(["Manager"]):
        process_blocks()
