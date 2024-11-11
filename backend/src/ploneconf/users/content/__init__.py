from plone.app.textfield import RichText as RichTextField
from plone.app.z3cform.widgets.richtext import RichTextFieldWidget
from plone.autoform import directives
from plone.dexterity.content import Container
from plone.namedfile import field as namedfile
from plone.schema import Email
from plone.supermodel import model
from ploneconf import _
from ploneconf.settings import CORE_TEAM
from ploneconf.settings import ORGANIZERS_CORE_GROUP
from ploneconf.settings import USER_CATEGORIES
from ploneconf.users.utils import validate_unique_email
from Products.membrane.interfaces import IMembraneUserObject
from zope import schema
from zope.interface import implementer
from zope.interface import Invalid
from zope.interface import invariant


class IBaseUser(model.Schema):
    id = schema.ASCIILine(title=_("User ID"), required=True)
    directives.order_before(id="*")

    title = schema.TextLine(readonly=True)
    first_name = schema.TextLine(
        title=_("First Name"),
        required=True,
    )
    last_name = schema.TextLine(
        title=_("Last Name"),
        required=True,
    )

    text = RichTextField(
        title=_("Bio"),
        description="",
        required=False,
    )
    directives.widget("text", RichTextFieldWidget)
    model.primary("text")

    location = schema.TextLine(
        title=_("Location"),
        required=False,
    )

    image = namedfile.NamedBlobImage(
        title=_("Picture"),
        description="",
        required=False,
    )

    email = Email(
        title=_("E-mail Address"),
        required=True,
    )
    model.fieldset("credentials", label=_("Credentials"), fields=["email"])

    directives.read_permission(
        id="zope2.View",
        email="zope2.View",
        text="zope2.View",
    )
    directives.write_permission(
        id="cmf.ReviewPortalContent",
        email="cmf.ReviewPortalContent",
        text="cmf.ModifyPortalContent",
    )

    @invariant
    def email_unique(data):
        """The email must be unique, as it is the login name (user name).

        The tricky thing is to make sure editing a user and keeping
        his email the same actually works.
        """
        user = data.__context__
        if user is not None:
            if getattr(user, "email", None) and user.email == data.email:
                # No change, fine.
                return
        error = validate_unique_email(data.email)
        if error:
            raise Invalid(error)

    exclude_from_nav = schema.Bool(
        default=True,
        required=False,
    )
    directives.omitted("exclude_from_nav")


@implementer(IBaseUser, IMembraneUserObject)
class BaseUser(Container):
    """A Membrane user."""

    @property
    def title(self):
        return f"{self.first_name} {self.last_name}"

    @title.setter
    def title(self, value):
        # title is not writable
        pass

    def getUserId(self):
        return self.id

    def getUserName(self):
        return self.email

    def get_full_name(self):
        return self.title

    @property
    def categories(self) -> list:
        categories = set(USER_CATEGORIES.get(self.portal_type, []))
        email = self.email
        if email in CORE_TEAM:
            categories.add(ORGANIZERS_CORE_GROUP)
        ticket_class = getattr(self, "ticket_class_id", "")
        for item in USER_CATEGORIES.get(ticket_class, []):
            categories.add(item)
        return list(categories)
