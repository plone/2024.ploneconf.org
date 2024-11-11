from plone.base.utils import safe_text
from plone.indexer.decorator import indexer
from ploneconf.users.content.attendee import IAttendee


@indexer(IAttendee)
def searchable_text_indexer(obj):
    """Indexer to create searchable text info."""
    return " ".join(
        [
            safe_text(obj.title),
            safe_text(obj.email),
        ]
    )


@indexer(IAttendee)
def subject_indexer(obj):
    """Indexer to create Subject."""
    categories = obj.categories
    return categories or []
