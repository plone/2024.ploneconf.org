def modification_handler(obj, _event):
    """After modifying a Conference Session, reindex the presenter."""
    if not obj.presenters:
        return
    rel_presenters = obj.presenters
    # Reindex labels attribute on presenters
    for relation in rel_presenters:
        presenter = relation.to_object
        presenter.reindexObject(idxs=["labels"])
