from Acquisition import aq_parent
from collective.exportimport import config
from collective.exportimport.export_content import ExportContent as BaseExportView
from pathlib import Path
from plone import api
from plone.dexterity.content import DexterityContent
from ploneconf import logger
from ploneconf.exportimport import helpers
from ploneconf.exportimport.interfaces import IBlobsMarker
from Products.Five import BrowserView
from typing import List
from zope.interface import alsoProvides


class ExportAll(BrowserView):
    directory: Path
    _current_content: List[Path]

    def __call__(self):
        request = self.request
        self.other_exports = helpers.default_exports()
        self.directory = helpers.export_dir()
        if not request.form.get("form.submitted", False):
            return self.index()
        # Get exports
        all_exports = request.form.get("exports", [])
        if all_exports:
            # Remove contents, as it is always required
            all_exports.remove("contents")

        # To handle an issue with json_body deserialization
        request["BODY"] = {}
        other_exports = all_exports or self.other_exports
        alsoProvides(self.request, IBlobsMarker)
        config.CENTRAL_DIRECTORY = str(self.directory)
        # pass the target-dir to blob-serializer via request
        request.form["package_directory"] = config.CENTRAL_DIRECTORY
        # Export all content
        export_name = "export_conf_content"
        view = api.content.get_view(export_name, self.context, request)
        # small hack to get all exportable types from the view
        view.portal_type = []
        view.path = "/".join(self.context.getPhysicalPath())
        view.depth = -1
        portal_types = [i["value"] for i in view.portal_types()]
        download_to_server = request.form.get("download_to_server", 2)
        split_files = download_to_server == 2
        filename = "items.json"
        if not split_files:
            portal_types.remove("Plone Site")
            filename = "content.json"
        request.form["filename"] = filename
        view(
            portal_type=portal_types,
            include_blobs=2,
            download_to_server=download_to_server,
        )
        logger.info(f"Finished {export_name}")

        if not split_files:
            portal_types = ["Plone Site"]
            request.form["filename"] = "portal.json"
            view(portal_type=portal_types, include_blobs=2, download_to_server=True)
            logger.info(f"Finished {export_name}")

        for export in other_exports:
            export_view = api.content.get_view(
                f"export_{export}", self.context, request
            )
            request.form["form.submitted"] = True
            request.form["filename"] = f"{export}.json"
            export_view(download_to_server=True)

        logger.info("Finished export_all")
        return self.request.response.redirect(self.context.absolute_url())


class ExportContent(BaseExportView):
    """Export content from a distribution."""

    PORTAL_URL: str = ""

    def __call__(
        self,
        portal_type=None,
        path=None,
        depth=-1,
        include_blobs=1,
        download_to_server=False,
        migration=True,
        include_revisions=False,
    ):
        self.PORTAL_URL = api.portal.get().absolute_url()
        request = self.request
        if download_to_server == 2:
            package_directory = request.form["package_directory"]
            helpers.remove_path(package_directory)
        return super().__call__(
            portal_type,
            path,
            depth,
            include_blobs,
            download_to_server,
            migration,
            include_revisions,
        )

    def global_obj_hook(self, obj: DexterityContent) -> DexterityContent:
        """Filter content to be exported."""
        parent = aq_parent(obj)
        portal_type = getattr(parent, "portal_type", "")
        if portal_type != "LIF":
            return obj
        lrf = aq_parent(parent)
        language = lrf.id
        if language != "en":
            return
        return obj

    def global_dict_hook(self, item: dict, obj: DexterityContent) -> dict:
        """Clean up data before export."""
        item = helpers.remove_site_root(item, self.PORTAL_URL)
        type_ = item["@type"]
        parent_type = item.get("parent", {}).get("@type", "")
        # Fix Author
        item["creators"] = ["organizer"]
        if type_ == "Plone Site":
            # To avoid a conflict between @id and id
            item["@id"] = f"/{item['id']}"
        if parent_type == "LIF":
            uid = item["UID"][:32]
            item["UID"] = uid
        if "blocks" in item:
            blocks = item["blocks"]
            item["blocks"] = helpers.parse_blocks(blocks)
        return item
