from plone import api
from ploneconf import logger


def _process_blocks(old_blocks: dict) -> dict:
    blocks = {}
    for block_id, block_data in old_blocks.items():
        type_ = block_data["@type"]
        func = BLOCK_PARSERS.get(type_)
        if func:
            block_data = func(block_data)
        blocks[block_id] = block_data
    return blocks


def _process_preview_image(block_data: dict) -> dict:
    preview_image = []
    old_preview_images = block_data["preview_image"]
    for item in old_preview_images:
        obj_path = item["@id"]
        if "resolveuid" in obj_path:
            obj_path = obj_path.split("/")[-1]
            catalog_entry = api.content.find(UID=obj_path)
        else:
            obj = api.content.get(path=obj_path)
            catalog_entry = api.content.find(UID=obj.UID())
        image_scales = catalog_entry[0].image_scales if catalog_entry else None
        if image_scales:
            item["image_scales"] = image_scales
        preview_image.append(item)
    block_data["preview_image"] = preview_image
    return block_data


def _process_href(block_data: dict) -> dict:
    href = block_data["href"][0]
    obj_path = href["@id"]
    obj = api.content.get(path=obj_path)
    if obj:
        catalog_entry = api.content.find(UID=obj.UID())
        image_scales = catalog_entry[0].image_scales if catalog_entry else None
        if image_scales:
            href["image_scales"] = image_scales
        block_data["href"] = [href]
    else:
        logger.info(f"Ignoring {obj_path}")
    return block_data


def _grid(block_data: dict) -> dict:
    block_data["blocks"] = _process_blocks(block_data["blocks"])
    return block_data


def _teaser(block_data: dict) -> dict:
    block_data = _process_href(block_data)
    if "preview_image" in block_data:
        block_data = _process_preview_image(block_data)
    return block_data


def _slider(block_data: dict) -> dict:
    slides = []
    for slide in block_data["slides"]:
        slide = _process_href(slide)
        slides.append(slide)
    block_data["slides"] = slides
    return block_data


BLOCK_PARSERS = {
    "slider": _slider,
    "teaser": _teaser,
    "gridBlock": _grid,
}

PORTAL_TYPES = ["Document", "LRF", "SponsorsDB"]


def process_blocks():
    """Process blocks in content items to fix image scales."""
    block_types = [key for key in BLOCK_PARSERS]
    brains = api.content.find(portal_type=PORTAL_TYPES, block_types=block_types)
    for brain in brains:
        obj = brain.getObject()
        obj.blocks = _process_blocks(obj.blocks)
        logger.info(f"Processed {obj}")
