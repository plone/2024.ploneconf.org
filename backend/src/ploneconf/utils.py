from Acquisition import aq_base
from Acquisition import aq_parent
from plone import api
from plone.base.interfaces import INavigationRoot
from plone.dexterity.content import DexterityContent
from ploneconf.behaviors.links import ILinkInformation

import random
import string


def generate_links_dict(content: ILinkInformation) -> dict:
    """Links information packaged as a dictionary."""
    content = aq_base(content)
    keys = [
        "remoteUrl",
        "twitter",
        "bluesky",
        "github",
        "mastodon",
        "instagram",
        "linkedin",
        "youtube",
        "facebook",
    ]

    links = {}
    for key in keys:
        value = getattr(content, key, None)
        if not value:
            continue
        links[key] = value
    return links


def find_nav_root(context: DexterityContent) -> DexterityContent:
    """Find nearest navigation root."""
    if INavigationRoot.providedBy(context):
        return context
    else:
        return find_nav_root(aq_parent(context))


def sponsor_levels(context):
    items = []
    navroot = find_nav_root(context)
    brains = api.content.find(navroot, portal_type="SponsorsDB")
    if brains:
        sponsors_db = brains[0].getObject()
        brains = api.content.find(
            sponsors_db, portal_type="SponsorLevel", sort_on="getObjPositionInParent"
        )
        for brain in brains:
            level_id = brain.getId
            level_title = brain.Title
            level_url = brain.getURL()
            # HACK
            display_frontpage = False if level_id in ("supporting", "oss") else True
            items.append((level_id, level_title, level_url, display_frontpage))
    return items


PASS_LEN = 12
PASS_CHARS = string.ascii_lowercase + string.hexdigits + "#@!"


def generate_password(user_id: str, chars: int = PASS_LEN) -> str:
    random.seed(user_id)
    return "".join([random.choice(PASS_CHARS) for _ in range(chars)])
