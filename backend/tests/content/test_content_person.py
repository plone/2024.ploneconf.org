from plone import api
from ploneconf.content.person import IPerson
from ploneconf.content.person import Person
from z3c.relationfield import RelationValue
from zope.component import createObject
from zope.component import getUtility
from zope.intid.interfaces import IIntIds

import pytest


@pytest.fixture
def schedule_folder(portal):
    return portal["en"]["schedule"]


@pytest.fixture
def speakers_folder(portal):
    return portal["en"]["speakers"]


@pytest.fixture
def person(speakers_folder) -> Person:
    person = api.content.create(
        container=speakers_folder,
        type="Person",
        id="ada-lovelace",
        title="Ada Lovelace",
    )
    return person


@pytest.fixture
def create_activity(schedule_folder):
    def func(portal_type: str, person: Person):
        intids = getUtility(IIntIds)
        person_value = RelationValue(intids.getId(person))
        return api.content.create(
            container=schedule_folder,
            type=portal_type,
            id=f"a-{portal_type.lower()}",
            title=f"A {portal_type}",
            presenters=[
                person_value,
            ],
        )

    return func


class PersonIntegrationTest:
    def test_fti(self, get_fti):
        fti = get_fti("Person")
        assert fti

    def test_factory(self, get_fti):
        fti = get_fti("Person")
        factory = fti.factory
        obj = createObject(factory)
        assert IPerson.providedBy(obj)

    def test_adding(self, speakers_folder):
        speakers_folder.invokeFactory("Person", "Person")
        assert IPerson.providedBy(speakers_folder["Person"])

    def test_activities(self, person, create_activity):
        assert len(person.activities) == 0

        create_activity("Keynote", person)
        assert len(person.activities) == 1

        create_activity("Talk", person)
        assert len(person.activities) == 2

        create_activity("Training", person)
        assert len(person.activities) == 3

    def test_labels(self, person):
        assert len(person.activities) == 0

        create_activity("Keynote", person)
        create_activity("Talk", person)
        create_activity("Training", person)

        assert len(person.labels) == 3

        assert "keynote-speaker" in person.labels
        assert "speaker" in person.labels
        assert "instructor" in person.labels
