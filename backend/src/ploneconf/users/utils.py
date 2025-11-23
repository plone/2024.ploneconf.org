from AccessControl import Unauthorized
from plone import api
from plone.dexterity.content import DexterityContent
from ploneconf import _
from ploneconf import logger
from Products.membrane.config import TOOLNAME


def get_brains_for_email(context: DexterityContent, email: str, request=None) -> list:
    """Anonymous users should be able to look for email addresses.
    Otherwise they cannot log in.

    This searches in the membrane_tool and returns brains with this
    email address.  Hopefully the result is one or zero matches.

    Note that we search for exact_getUserName as the email address is
    supposed to be used a login name (user name).
    """
    try:
        email = email.strip()
    except (ValueError, AttributeError):
        return []
    if email == "" or "@" not in email:
        return []

    user_catalog = api.portal.get_tool(TOOLNAME)
    if user_catalog is None:
        logger.warning("Membrane_tool not found.")
        return []

    kw = {"exact_getUserName": email}
    users = user_catalog.unrestrictedSearchResults(**kw)
    return users


def get_user_id_for_email(context: DexterityContent, email: str) -> str:
    brains = get_brains_for_email(context, email)
    if len(brains) == 1:
        return brains[0].getUserId
    return ""


def validate_unique_email(email: str, context: DexterityContent | None = None) -> str:
    """Validate this email as unique in the site."""
    context = context if context else api.portal.get()
    matches = get_brains_for_email(context, email)
    if not matches:
        # This email is not used yet.  Fine.
        return ""
    if len(matches) > 1:
        msg = _(f"Multiple matches on email ${email}.", mapping={"email": email})
        logger.warning(msg)
        return msg
    # Might be this member, being edited.  That should have been
    # caught by our new invariant though, at least when changing the
    # email address through the edit interface instead of a
    # personalize_form.
    match = matches[0]
    try:
        found = match.getObject()
    except (AttributeError, KeyError, Unauthorized):
        # This is suspicious.  Best not to use this one.
        pass
    else:
        if found == context:
            # We are the only match.  Good.
            logger.debug(f"Only this object itself has email {email}")
            return

    # There is a match but it is not this member or we cannot get
    # the object.
    msg = _(f"Email ${email} is already in use.", mapping={"email": email})
    logger.debug(msg)
    return msg


def get_membrane_user(
    context: DexterityContent,
    principal_id: str,
    member_type: str = "Attendee",
    get_object: bool = False,
):
    catalog = api.portal.get_tool(TOOLNAME)
    if catalog is None:
        logger.debug("Membrane_tool not found.")
        # Probably just the admin user, in which case we can just
        # return nothing.
        return None

    res = catalog(exact_getUserId=principal_id, portal_type=member_type)
    if len(res) != 1:
        return None
    brain = res[0]
    return brain.getObject() if get_object else brain
