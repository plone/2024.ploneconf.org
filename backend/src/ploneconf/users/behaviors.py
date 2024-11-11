from AuthEncoding import AuthEncoding
from plone import api
from plone.autoform import directives
from plone.autoform.interfaces import IFormFieldProvider
from plone.memoize import ram
from plone.supermodel import model
from ploneconf import _
from ploneconf.users.content import IBaseUser
from Products.CMFPlone.utils import safe_encode
from Products.membrane import interfaces as ifaces
from z3c.form.interfaces import IAddForm
from z3c.form.interfaces import IEditForm
from zope import schema
from zope.component import adapter
from zope.component import queryUtility
from zope.interface import implementer
from zope.interface import Interface
from zope.interface import Invalid
from zope.interface import invariant
from zope.interface import provider

import bcrypt


ALLOWED_STATES = [
    "registered",
    "checked",
]


def _forever_cache_key(func, self, *args):
    """Cache this function call forever."""
    return (func.__name__, args)


def register_auth_encoding(identity):
    def register_once(cls):
        if identity not in set(AuthEncoding.listSchemes()):
            AuthEncoding.registerScheme(identity, cls())
        return cls

    return register_once


@register_auth_encoding("BCRYPT")
class BCRYPTEncryptionScheme:
    """A BCRYPT AuthEncoding."""

    def encrypt(self, pw):
        return bcrypt.hashpw(pw, bcrypt.gensalt())

    @ram.cache(_forever_cache_key)
    def validate(self, reference, attempt):
        """The bcrypt hash of the `attempt` string should match
        the `reference` string
        """
        try:
            valid = bcrypt.hashpw(attempt, reference) == reference
        except ValueError:
            valid = False
        return valid


class IPasswordChecker(Interface):
    """Check password strength or related"""

    def check(password):
        """checks password if it is ok.

        returns False or an unicode/msgid why its wrong
        """


class IPasswordCapable(Interface):
    """Marker Interface for content capable of providing passwords"""


class IProvidePasswordsSchema(model.Schema):
    """Add password fields"""

    # Note that the passwords fields are not required; this means we
    # can add members without having to add passwords at that time.
    # The password reset tool should hopefully be able to deal with
    # that.

    password = schema.Password(
        title=_("Password"),
        required=False,
    )

    confirm_password = schema.Password(
        title=_("Confirm Password"),
        required=False,
    )

    @invariant
    def password_matches_confirmation(data):
        """password field must match confirm_password field."""
        password = getattr(data, "password", None)
        confirm_password = getattr(data, "confirm_password", None)
        if not password and not confirm_password:
            return
        if password != confirm_password:
            raise Invalid(_("The password and confirmation do not match."))
        pwchecker = queryUtility(IPasswordChecker)
        if not pwchecker:
            return
        result = pwchecker.check(password)
        if result:
            raise Invalid(result)


@provider(IFormFieldProvider)
class IProvidePasswords(IProvidePasswordsSchema):
    """Add password fields"""

    model.fieldset(
        "credentials", label=_("Credentials"), fields=["password", "confirm_password"]
    )

    directives.omitted("password", "confirm_password")
    directives.no_omit(IAddForm, "password", "confirm_password")
    directives.no_omit(IEditForm, "password", "confirm_password")
    directives.write_permission(
        password="cmf.ModifyPortalContent",
        confirm_password="cmf.ModifyPortalContent",
    )


@implementer(IProvidePasswordsSchema)
@adapter(IBaseUser)
class PasswordProvider:
    def __init__(self, context):
        self.context = context

    @property
    def password(self):
        return getattr(self.context, "password", None)

    @password.setter
    def password(self, password):
        # When editing, the password field is empty in the browser; do
        # not do anything then.
        if password is not None:
            self.context.password = AuthEncoding.pw_encrypt(
                safe_encode(password), encoding="BCRYPT"
            )

    @property
    def confirm_password(self):
        # Just return the original password.
        return self.password

    @confirm_password.setter
    def confirm_password(self, confirm_password):
        # No need to store this.
        return


@adapter(IBaseUser)
@implementer(ifaces.IMembraneUserAuth)
class MembraneUserAuthentication:
    def __init__(self, context):
        self.user = context

    @ram.cache(_forever_cache_key)
    def _pw_validate(self, reference, password):
        return AuthEncoding.pw_validate(reference, password)

    def verifyCredentials(self, credentials):
        """Returns True is password is authenticated, False if not."""
        user = self.user
        if credentials.get("login") != user.getUserName():
            # Should never happen, as the code should then never end
            # up here, but better safe than sorry.
            return False
        password_provider = IProvidePasswordsSchema(user)
        if not password_provider:
            return False
        return self._pw_validate(
            password_provider.password, credentials.get("password", "")
        )

    def authenticateCredentials(self, credentials):
        # Should not authenticate when the user is not enabled.
        user = self.user
        state = api.content.get_state(user)
        if state not in ALLOWED_STATES:
            return
        if self.verifyCredentials(credentials):
            return (user.getUserId(), user.getUserName())


@adapter(IPasswordCapable)
@implementer(ifaces.IMembraneUserChanger)
class MembraneUserPasswordChanger:
    """Supports resetting a member's password via the password reset form."""

    def __init__(self, context):
        self.user = context

    def doChangeUser(self, user_id, password, **kwargs):
        password_provider = IProvidePasswordsSchema(self.user)
        password_provider.password = password


@provider(IFormFieldProvider)
class IEventbrite(model.Schema):
    """Plone Conference Attendee via Eventbrite."""

    event_id = schema.TextLine(title=_("Event id"), required=False)
    order_id = schema.TextLine(title=_("Order id"), required=False)
    order_date = schema.Datetime(title=_("Order datetime"), required=False)
    participant_id = schema.TextLine(title=_("Participant id"), required=False)
    ticket_class_name = schema.TextLine(title=_("Ticket Class"), required=False)
    ticket_class_id = schema.TextLine(title=_("Ticket Class ID"), required=False)
    barcode = schema.TextLine(title=_("Barcode"), required=False)
    ticket_url = schema.TextLine(title=_("URL"), required=False)

    model.fieldset(
        "eventbrite",
        label=_("Eventbrite"),
        fields=[
            "event_id",
            "order_id",
            "order_date",
            "participant_id",
            "ticket_class_name",
            "ticket_class_id",
            "ticket_url",
            "barcode",
        ],
    )
    directives.read_permission(
        event_id="cmf.ReviewPortalContent",
        order_id="cmf.ReviewPortalContent",
        order_date="cmf.ReviewPortalContent",
        participant_id="cmf.ReviewPortalContent",
        ticket_class_name="cmf.ReviewPortalContent",
        ticket_class_id="cmf.ReviewPortalContent",
        ticket_url="cmf.ReviewPortalContent",
        barcode="cmf.ReviewPortalContent",
    )
    directives.write_permission(
        event_id="cmf.ReviewPortalContent",
        order_id="cmf.ReviewPortalContent",
        order_date="cmf.ReviewPortalContent",
        participant_id="cmf.ReviewPortalContent",
        ticket_class_name="cmf.ReviewPortalContent",
        ticket_class_id="cmf.ReviewPortalContent",
        ticket_url="cmf.ReviewPortalContent",
        barcode="cmf.ReviewPortalContent",
    )
