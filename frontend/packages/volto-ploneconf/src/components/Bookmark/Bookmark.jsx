import { useEffect, useState } from 'react';
import cx from 'classnames';
import { flattenToAppURL } from '@plone/volto/helpers';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { addBookmark, deleteBookmark } from '../../actions/bookmark/bookmark';
import { Button } from 'semantic-ui-react';
import { Icon } from '@plone/volto/components';
import { defineMessages, injectIntl, useIntl } from 'react-intl';
import bookmarkSVG from '@plone/volto/icons/star.svg';
import bookmarkFilledSVG from '@plone/volto/icons/check.svg';

const messages = defineMessages({
  label_addbookmark: {
    id: 'Add to my schedule',
    defaultMessage: 'Add to my schedule',
  },
});

const Bookmark = ({ item }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.userSession.token, shallowEqual);
  const [hasBookmark, setHasBookmark] = useState(item.bookmark);
  const [toggle, setToggle] = useState(false);
  const isTraining = item['@type'] === 'Training';
  const intl = useIntl();
  useEffect(() => {
    if (toggle) {
      const url = flattenToAppURL(item['@id']);
      const uuid = item['UID'];
      let action = addBookmark;
      if (hasBookmark) {
        action = deleteBookmark;
      }
      dispatch(action(flattenToAppURL(url), uuid));
      setToggle(false);
      setHasBookmark(!hasBookmark);
    }
  }, [dispatch, item, toggle, hasBookmark]);

  const doToggle = () => {
    if (!isTraining) {
      setToggle(true);
    }
  };

  return (
    token && (
      <div
        className={cx('bookmark', {
          bookmarked: hasBookmark,
        })}
      >
        {isTraining && hasBookmark && (
          <Button
            icon
            basic
            className="bookmarkButton noAction"
            aria-label={intl.formatMessage(messages.label_addbookmark)}
          >
            <Icon
              name={hasBookmark ? bookmarkFilledSVG : bookmarkSVG}
              size="20px"
              title={intl.formatMessage(messages.label_addbookmark)}
            />
          </Button>
        )}
        {!isTraining && (
          <Button
            icon
            basic
            className="bookmarkButton"
            aria-label={intl.formatMessage(messages.label_addbookmark)}
            onClick={() => doToggle()}
          >
            <Icon
              name={hasBookmark ? bookmarkFilledSVG : bookmarkSVG}
              size="20px"
              title={intl.formatMessage(messages.label_addbookmark)}
            />
          </Button>
        )}
      </div>
    )
  );
};

export default injectIntl(Bookmark);
