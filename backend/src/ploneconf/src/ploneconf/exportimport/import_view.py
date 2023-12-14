from App.config import getConfiguration
from collective.exportimport import config
from collective.exportimport import import_content
from collective.exportimport.import_content import ImportContent as BaseImportView
from pathlib import Path
from plone import api
from ploneconf import logger
from ploneconf.exportimport import helpers
from ploneconf.exportimport.interfaces import ExportFormat
from Products.Five import BrowserView
from typing import List


class ImportAll(BrowserView):
    """View to import distribution content."""

    CONTENT_VIEW: str = "import_conf_content"

    def __call__(self, path=None):
        request = self.request
        if not path and not request.form.get("form.submitted", False):
            return self.index()
        elif path:
            # path the config that is usually set via env-variables
            config.CENTRAL_DIRECTORY = str(path)
            import_content.BLOB_HOME = config.CENTRAL_DIRECTORY
        else:
            # Fallback to default (e.g. var/instance/import)
            cfg = getConfiguration()
            path = Path(cfg.clienthome) / "import"

        view = api.content.get_view(self.CONTENT_VIEW, self.context, request)
        request.form["form.submitted"] = True
        # Update the existing content using the update-strategy
        request.form["handle_existing_content"] = 2
        # Commit every 500 items
        request.form["commit"] = 500
        is_one_file = helpers.sniff_export_format(path) == ExportFormat.ONE_FILE
        if is_one_file:
            file_names = [
                "content.json",
                "portal.json",
            ]
            for file_name in file_names:
                view(server_file=file_name, return_json=True)
                logger.info(f"Imported {file_name[:-4]}")
        else:
            directory = path / "items"
            view(server_directory=directory, return_json=True)
            logger.info(f"Imported content from {directory}")

        other_imports = [step[0] for step in helpers.ALL_EXPORT_STEPS]
        for name in other_imports:
            view = api.content.get_view(f"import_{name}", self.context, request)
            importfile = path / f"{name}.json"
            if importfile.exists():
                results = view(jsonfile=importfile.read_text(), return_json=True)
                logger.info(results)
            else:
                logger.info(f"Skipping import of {name} because no file {importfile}")

        return request.response.redirect(self.context.absolute_url())


class ImportContent(BaseImportView):
    languages: List[str]
    default_language: str
    portal_id: str

    def __call__(
        self,
        jsonfile=None,
        return_json=False,
        limit=None,
        server_file=None,
        iterator=None,
        server_directory=False,
    ):
        self.portal_uid = api.content.get_uuid(api.portal.get())
        self.default_language = api.portal.get_registry_record(
            "plone.default_language", default="en"
        )
        self.languages = api.portal.get_registry_record(
            "plone.available_languages",
            default=[
                "en",
            ],
        )
        return super().__call__(
            jsonfile, return_json, limit, server_file, iterator, server_directory
        )

    def global_dict_hook(self, item: dict) -> dict:
        if item["@type"] == "Plone Site":
            item["UID"] = self.portal_uid
        # Fix Language
        current = item.get("language")
        if current not in self.languages:
            item["language"] = self.default_language
        return item
