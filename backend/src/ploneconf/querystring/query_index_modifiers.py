from plone.app.querystring.interfaces import IParsedQueryIndexModifier
from zope.interface import implementer


@implementer(IParsedQueryIndexModifier)
class attendee_type:
    def __call__(self, value):
        return ("portal_type", value)


@implementer(IParsedQueryIndexModifier)
class attendee_state:
    def __call__(self, value):
        return ("review_state", value)


@implementer(IParsedQueryIndexModifier)
class attendee_category:
    def __call__(self, value):
        if isinstance(value, str):
            value = [value]
        return ("Subject", value)
