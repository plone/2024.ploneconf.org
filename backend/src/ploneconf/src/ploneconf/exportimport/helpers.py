from pathlib import Path
from ploneconf.exportimport.interfaces import ExportFormat
from ploneconf.exportimport.interfaces import ExportStep
from typing import List

import json
import ploneconf
import shutil


EXPORT_STEPS_BASE = [
    ("discussion", True),
    ("ordering", True),
    ("redirects", True),
    ("relations", True),
    ("translations", True),
]

EXPORT_STEPS_MEMBERS = [
    ("members", False),
    ("localroles", False),
]

ALL_EXPORT_STEPS = EXPORT_STEPS_BASE + EXPORT_STEPS_MEMBERS


def export_dir() -> Path:
    return Path(ploneconf.__file__).parent / "setuphandlers" / "content"


def default_exports() -> List[ExportStep]:
    """Return a list of available exports for a given distribution."""
    _exports = []
    _exports.extend(EXPORT_STEPS_BASE)
    directory = export_dir()
    for name, selected in EXPORT_STEPS_MEMBERS:
        already_exported = (directory / f"{name}.json").exists()
        selected = True if already_exported else selected
        _exports.append((name, selected))
    return [ExportStep(name, selected) for name, selected in _exports]


def remove_site_root(item: dict, portal_url: str) -> dict:
    """Remove references to site root from exported content."""
    item_str = json.dumps(item)
    replacements = [
        (f'"@id": "{portal_url}/', '"@id": "/'),
        (f'"@id": "{portal_url}"', '"@id": "/"'),
        (f'"url": "{portal_url}/', '"url": "/'),
    ]
    for pattern, replace in replacements:
        item_str = item_str.replace(pattern, replace)
    return json.loads(item_str)


def _fix_image_paths(data: list) -> list:
    """Rewrite image urls to use the scale name.

    This is not ideal in terms of performance, but
    it 'works' for imported content.
    """
    parsed = []
    for info in data:
        info.pop("image_scales", [])
        parsed.append(info)
    return parsed


def _fix_grid_block(block: dict) -> dict:
    """Remove references to computed scales in images."""
    for block_id, block_data in block["blocks"].items():
        for key in ("preview_image", "image"):
            image_data = block_data.get(key)
            if not image_data:
                continue
            block_data[key] = _fix_image_paths(image_data)
        block["blocks"][block_id] = block_data
    return block


def _fix_slider_block(block: dict) -> dict:
    """Remove references to computed scales in images."""
    for block_data in block["slides"]:
        # Remove image_scales
        block_data.pop("image_scales", [])
    return block


def _fix_teaser_block(block: dict) -> dict:
    """Remove references to computed scales in images."""
    for key in ("preview_image", "image"):
        image_data = block.get(key)
        if not image_data:
            continue
        block[key] = _fix_image_paths(image_data)
    return block


BLOCKS_HANDLERS = {
    "gridBlock": _fix_grid_block,
    "slider": _fix_slider_block,
    "teaser": _fix_teaser_block,
}


def parse_blocks(blocks: dict) -> dict:
    """Clean up blocks."""
    parsed = {}
    for block_uid, block in blocks.items():
        type_ = block.get("@type")
        func = BLOCKS_HANDLERS.get(type_, None)
        block = func(block) if func else block
        parsed[block_uid] = block
    return parsed


def remove_path(path: Path):
    """Remove existing files from a path"""
    shutil.rmtree(path, ignore_errors=True)


def sniff_export_format(path: Path) -> ExportFormat:
    """Identify what export format was used."""
    items_subdir = path / "items"
    if items_subdir.exists() and items_subdir.is_dir():
        return ExportFormat.SPLIT
    return ExportFormat.ONE_FILE
