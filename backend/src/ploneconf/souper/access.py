from datetime import datetime
from plone import api
from plone.restapi.serializer.converters import json_compatible
from repoze.catalog.query import Eq
from repoze.catalog.query import Query
from souper.soup import get_soup
from souper.soup import Record

import typing
import uuid


class BaseAPI:
    soup_id: str = ""
    record_attrs: tuple[str] = (
        "uid",
        "created",
    )

    @property
    def _soup(self):
        """get soup storage for bookmarks"""
        soup = getattr(self, "_soup_instance", None)
        if soup is None:
            soup = get_soup(self.soup_id, api.portal.get())
            setattr(self, "_soup_instance", soup)
        return soup

    def _fetch_one(self, query: Query) -> Record | None:
        """fetch a single record from query.

        return None if non-existing
        raises ValueError if no unique single result is found
        """
        lazy_res = self._soup.lazy(query, with_size=True)
        size = next(lazy_res)
        if size > 1:
            raise ValueError(f"Query does not point to a unique result:\n{query}")
        if size == 0:
            return None
        return next(lazy_res)()

    def _dictify(self, record: Record) -> dict:
        result = {k: record.attrs[k] for k in self.record_attrs if k in record.attrs}
        return result


class Tracking(BaseAPI):
    """API to manage user tracking"""

    soup_id: str = "ploneconf_tracking"
    record_attrs: tuple[str] = (
        "uid",
        "created",
        "user_id",
        "action",
    )

    def get(
        self,
        user_id: str,
    ) -> list[Record]:
        records = [
            self._dictify(record)
            for record in self._soup.query(
                Eq("user_id", user_id), sort_index="created", reverse=True
            )
        ]
        return records

    def add(
        self,
        user_id: str,
        action: str,
    ) -> int | None:
        record = Record()
        record.attrs["user_id"] = user_id
        record.attrs["action"] = action
        record.attrs["created"] = json_compatible(datetime.now())
        if self._soup.add(record):
            return self._dictify(record)

    def get_by_action(
        self,
        action: str,
    ) -> list[Record]:
        records = [
            self._dictify(record)
            for record in self._soup.query(
                Eq("action", action), sort_index="created", reverse=True
            )
        ]
        return records


class SessionBookmarks(BaseAPI):
    """API to manage booksmarks in the portal"""

    soup_id: str = "ploneconf_sessions"
    record_attrs: tuple[str] = (
        "uid",
        "created",
        "user_id",
        "slot_id",
    )

    def _get(
        self,
        user_id: str,
        slot_id: uuid.UUID,
    ) -> Record | None:
        return self._fetch_one(Eq("user_id", user_id) & Eq("slot_id", slot_id))

    def add(
        self,
        user_id: str,
        slot_id: uuid.UUID,
    ) -> int | None:
        """add new entry.

        uniqueness is given by tuple of user_id and slot_id.

        returns None if such a tuple already exists
        returns record_id if successful added
        """
        # check existing
        if self._get(user_id, slot_id) is not None:
            return None
        record = Record()
        record.attrs["user_id"] = user_id
        record.attrs["slot_id"] = slot_id
        record.attrs["created"] = json_compatible(datetime.now())
        if self._soup.add(record):
            return self._dictify(record)

    def delete(
        self,
        user_id: str,
        slot_id: uuid.UUID,
    ) -> bool:
        """delete existing entry

        uniqueness is given by tuple of user_id, slot_id.

        returns False if no such a tuple already exists
        returns True if the Record was successfully deleted
        """
        record = self._get(user_id, slot_id)
        if record is None:
            return False
        del self._soup[record]
        return True

    def get(
        self,
        user_id: str,
        slot_id: uuid.UUID,
    ) -> typing.Union[dict, None]:
        """get one bookmark

        uniqueness is given by tuple of user_id, slot_id.

        returns None if no such a tuple already exists
        returns dictified data if update was successful
        """

        record = self._get(user_id, slot_id)
        if record is None:
            return None
        return self._dictify(record)

    def all_by_user_id(self, user_id: str) -> typing.Iterator[dict]:
        """get all bookmarks of an user_id

        return dictified data
        """
        query = Eq("user_id", user_id)
        for lazy_record in self._soup.lazy(query):
            yield self._dictify(lazy_record())


class TrainingRegistrations(BaseAPI):
    """API to manage training registrations."""

    soup_id: str = "ploneconf_training"
    record_attrs: tuple[str] = (
        "uid",
        "created",
        "user_id",
        "training_id",
        "state",
    )
    default_state: str = "registered"

    def _get(
        self,
        user_id: str,
        training_id: uuid.UUID,
    ) -> Record | None:
        return self._fetch_one(Eq("user_id", user_id) & Eq("training_id", training_id))

    def add(
        self,
        user_id: str,
        training_id: uuid.UUID,
    ) -> int | None:
        """add new entry.

        uniqueness is given by tuple of user_id and training_id.

        returns None if such a tuple already exists
        returns record_id if successful added
        """
        # check existing
        if self._get(user_id, training_id) is not None:
            return None
        record = Record()
        record.attrs["uid"] = str(uuid.uuid4())
        record.attrs["user_id"] = user_id
        record.attrs["training_id"] = training_id
        record.attrs["state"] = "registered"
        record.attrs["created"] = json_compatible(datetime.now())
        if self._soup.add(record):
            return self._dictify(record)

    def delete(
        self,
        user_id: str,
        training_id: uuid.UUID,
    ) -> bool:
        """delete existing entry

        uniqueness is given by tuple of user_id, training_id.

        returns False if no such a tuple already exists
        returns True if the Record was successfully deleted
        """
        record = self._get(user_id, training_id)
        if record is None:
            return False
        del self._soup[record]
        return True

    def get(
        self,
        user_id: str,
        training_id: uuid.UUID,
    ) -> typing.Union[dict, None]:
        """get one registration

        uniqueness is given by tuple of user_id, training_id.

        returns None if no such a tuple already exists
        returns dictified data if update was successful
        """

        record = self._get(user_id, training_id)
        if record is None:
            return None
        return self._dictify(record)

    def transition_training_users(self, training_id: str, users: list[str], state: str):
        """Transition users of a training."""
        records = []
        for user_id in users:
            record = self._get(user_id, training_id)
            record.attrs["state"] = state
            records.append(record)
        self._soup.reindex(records=records)
        return [record for record in self.users_by_training(training_id)]

    def users_by_training(
        self, training_id: str, state: str = ""
    ) -> typing.Iterator[dict]:
        """get all bookmarks of a training

        return dictified data
        """
        query = Eq("training_id", training_id)
        if state:
            query = query & Eq("state", state)
        for lazy_record in self._soup.lazy(query):
            yield self._dictify(lazy_record())
