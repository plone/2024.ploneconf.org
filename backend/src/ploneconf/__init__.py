"""Init and utils."""
from zope.i18nmessageid import MessageFactory

import logging


PACKAGE_NAME = "ploneconf"

_ = MessageFactory("ploneconf")

logger = logging.getLogger("ploneconf")
