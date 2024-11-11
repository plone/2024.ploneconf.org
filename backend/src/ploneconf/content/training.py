from plone.app.textfield import RichText
from ploneconf import _
from ploneconf.content.slot import ISlot
from ploneconf.content.slot import Slot
from ploneconf.souper.access import TrainingRegistrations
from zope import schema
from zope.interface import implementer


class ITraining(ISlot):
    """Plone Conference Training Session."""

    duration = schema.Choice(
        title=_("Duration"),
        description=_("Duration of the training"),
        required=False,
        vocabulary="ploneconf.vocabularies.training_duration",
    )

    requirements = RichText(
        title=_("Requirements"),
        description=_("Requirements of this training"),
        required=False,
        missing_value="",
    )

    allow_registration = schema.Bool(
        title=_("Allow registering"),
        default=False,
    )
    total_seats = schema.Int(
        title=_("Seats"),
        description=_("Total number of seats"),
        required=False,
        default=0,
    )


@implementer(ITraining)
class Training(Slot):
    """Convenience subclass for ``Training`` portal type."""

    @property
    def registrations(self) -> list[dict]:
        """Get registrations for a training."""
        catalog_api = TrainingRegistrations()
        registrations = catalog_api.users_by_training(self.UID())
        return [r for r in registrations]

    @property
    def available_seats(self) -> int:
        """Return the number of available seats."""
        registrations = self.registrations
        total_seats = self.total_seats
        return total_seats - len(registrations) if total_seats else 0
