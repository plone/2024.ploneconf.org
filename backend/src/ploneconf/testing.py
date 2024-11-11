from plone.app.contenttypes.testing import PLONE_APP_CONTENTTYPES_FIXTURE
from plone.app.robotframework.testing import REMOTE_LIBRARY_BUNDLE_FIXTURE
from plone.app.testing import applyProfile
from plone.app.testing import FunctionalTesting
from plone.app.testing import IntegrationTesting
from plone.app.testing import PloneSandboxLayer
from plone.testing import zope as zope_testing
from plone.testing.zope import WSGI_SERVER_FIXTURE
from Products import membrane

import ploneconf


orig_initialize = membrane.initialize


def initialize(context):
    orig_initialize(context)


# TODO We are patching the installation here, and should find a better way to
# do this
membrane.initialize = initialize


class Layer(PloneSandboxLayer):
    defaultBases = (PLONE_APP_CONTENTTYPES_FIXTURE,)

    def setUpZope(self, app, configurationContext):
        # Load any other ZCML that is required for your tests.
        # The z3c.autoinclude feature is disabled in the Plone fixture base
        # layer.
        import collective.exportimport
        import plone.restapi
        import Products.membrane

        self.loadZCML(package=collective.exportimport)
        self.loadZCML(package=Products.membrane)
        self.loadZCML(package=plone.restapi)
        self.loadZCML(package=ploneconf)
        zope_testing.installProduct(app, "Products.membrane")

    def setUpPloneSite(self, portal):
        applyProfile(portal, "ploneconf:default")
        applyProfile(portal, "ploneconf:initial")


FIXTURE = Layer()


INTEGRATION_TESTING = IntegrationTesting(
    bases=(FIXTURE,),
    name="PloneconfLayer:IntegrationTesting",
)


FUNCTIONAL_TESTING = FunctionalTesting(
    bases=(FIXTURE, WSGI_SERVER_FIXTURE),
    name="PloneconfLayer:FunctionalTesting",
)


ACCEPTANCE_TESTING = FunctionalTesting(
    bases=(
        FIXTURE,
        REMOTE_LIBRARY_BUNDLE_FIXTURE,
        WSGI_SERVER_FIXTURE,
    ),
    name="PloneconfLayer:AcceptanceTesting",
)
