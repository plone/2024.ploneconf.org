from plone import api
from ploneconf import logger
from ploneconf import PACKAGE_NAME
from ploneconf.content.sponsors.sponsors_db import SponsorsDB
from ploneconf.utils import find_nav_root


def _log_permission_change(path: str, permission_id: str, roles: list):
    roles = ", ".join(roles)
    logger.info(f"{path}: Set {permission_id} to roles {roles}")


def impose_limit(sponsors_db: SponsorsDB, event):
    key = f"{PACKAGE_NAME}.settings.limit_sponsors_db_per_nav_root"
    limit = api.portal.get_registry_record(key, default=True)
    if not limit:
        logger.info("Not limiting creation of new instances of SponsorsDB")
        return
    nav_root = find_nav_root(sponsors_db)
    path = "/".join(nav_root.getPhysicalPath())
    permission_id = f"{PACKAGE_NAME}: Add SponsorsDB"
    roles = []
    nav_root.manage_permission(permission_id, roles=roles, acquire=False)
    _log_permission_change(path, permission_id, roles)
