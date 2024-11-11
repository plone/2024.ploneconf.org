from plone.restapi.services.users.update import UsersPatch as BaseService
from zope.interface import implementer
from zope.publisher.interfaces import IPublishTraverse

import json


@implementer(IPublishTraverse)
class UsersPatch(BaseService):
    """Updates an existing user."""

    def reply(self):
        user_settings_to_update = json.loads(self.request.get("BODY", "{}"))
        if "description" in user_settings_to_update:
            user_settings_to_update["description"] = user_settings_to_update[
                "description"
            ]["data"]
            self.request.set("BODY", json.dumps(user_settings_to_update))
        super().reply()
        return self.reply_no_content()
