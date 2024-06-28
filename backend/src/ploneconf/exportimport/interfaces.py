"""Module where all interfaces, events and exceptions live."""
from collective.exportimport.interfaces import IPathBlobsMarker
from dataclasses import dataclass
from enum import Enum


class IBlobsMarker(IPathBlobsMarker):
    """A marker interface to override default serializers."""


@dataclass
class ExportStep:
    """A Step used in content export."""

    name: str
    selected: bool


class ExportFormat(Enum):
    """Represent the format used by the content export."""

    ONE_FILE = 1
    SPLIT = 2
