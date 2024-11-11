from borg.localrole.interfaces import ILocalRoleProvider
from plone import api
from plone.app.textfield.value import RichTextValue
from ploneconf import logger
from ploneconf.users.content import IBaseUser
from Products.membrane.interfaces import IMembraneUserProperties
from Products.PlonePAS.sheet import MutablePropertySheet
from zope.component import adapter
from zope.interface import implementer


@implementer(IMembraneUserProperties)
@adapter(IBaseUser)
class MembraneUserProperties:
    """User properties for this membrane context.

    Adapted from Products/membrane/at/properties.py
    """

    # Map from memberdata property to member field:
    property_map = dict(
        email="email",
        description="text",
        home_page="remoteUrl",
    )

    def __init__(self, context):
        self.user = context

    @property
    def fullname(self):
        # Note: we only define a getter; a setter would be too tricky
        # due to the multiple fields that are behind this one
        # property.
        return self.user.title

    @property
    def category(self):
        return self.user.portal_type

    @property
    def uuid(self):
        return api.content.get_uuid(self.user)

    def getPropertiesForUser(self, user, request=None):
        """Get properties for this user.

        Find the fields of the user schema that make sense as a user
        property in @@personal-information.

        Note: this method gets called a crazy amount of times...

        Also, it looks like we can ignore the user argument and just
        check self.context.
        """
        properties = {
            "fullname": self.fullname,
            "uuid": self.uuid,
            "category": self.category,
        }
        for prop_name, field_name in self.property_map.items():
            value = getattr(self.user, field_name, None)
            if value is None:
                # Would give an error like this:
                # ValueError: Property home_page: unknown type
                value = ""
            if isinstance(value, RichTextValue):
                value = value.output
            properties[prop_name] = value
        return MutablePropertySheet(self.user.id, **properties)

    def setPropertiesForUser(self, user, propertysheet):
        """
        Set modified properties on the user persistently.

        Should raise a ValueError if the property or property value is
        invalid.  We choose to ignore it and just handpick the ones we
        like.

        For example, fullname cannot be handled as we don't know how
        to split that into first, middle and last name.
        """
        properties = dict(propertysheet.propertyItems())
        for prop_name, field_name in self.property_map.items():
            value = properties.get(prop_name, "")
            if prop_name == "description":
                value = RichTextValue(value)
            # Only strip text or non-iterable value.
            if hasattr(value, "strip"):
                value = value.strip()
            logger.debug(f"Setting field {field_name}: {value}")
            setattr(self.user, field_name, value)

    def deleteUser(self, user_id):
        """
        Remove properties stored for a user

        Note that membrane itself does not do anything here.  This
        indeed seems unneeded, as the properties are stored on the
        content item, so they get removed anyway without needing
        special handling.
        """
        pass


@implementer(ILocalRoleProvider)
@adapter(IBaseUser)
class MembraneRoleProvider:
    def __init__(self, context):
        self.user = context
        self.roles = self._roles()

    def _roles(self):
        return ("Reader", "Owner")

    def getRoles(self, user_id):
        user = self.user
        if user.getUserId() != user_id:
            return ()
        return self.roles

    def getAllRoles(self):
        """Here we should apparently enumerate all users who should
        get an extra role.
        """
        yield self.user.getUserId(), self.roles
