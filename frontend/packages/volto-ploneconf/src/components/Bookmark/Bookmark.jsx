import { useEffect, useState } from 'react';
import cx from 'classnames';
import { flattenToAppURL } from '@plone/volto/helpers';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { addBookmark, deleteBookmark } from '../../actions/bookmark/bookmark';
import { defineMessages, injectIntl, useIntl } from 'react-intl';
import { Button, Tooltip, CheckboxIcon, TitleIcon } from '@plone/components';
import { TooltipTrigger } from 'react-aria-components';
import '@plone/components/src/styles/basic/Tooltip.css';

const messages = defineMessages({
  label_addbookmark: {
    id: 'Add to my schedule',
    defaultMessage: 'Add to my schedule',
  },
  label_removebookmark: {
    id: 'Remove from my schedule',
    defaultMessage: 'Remove from my schedule',
  },
  labelRegistered: {
    id: 'Registered to this training',
    defaultMessage: 'Registered to this training',
  },
});

const Bookmark = ({ item, className }) => {
  const additionalClassNames = className ? className : '';
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

  const doToggle = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isTraining) {
      setToggle(true);
    }
  };
  const buttonMessage = hasBookmark
    ? intl.formatMessage(messages.label_removebookmark)
    : intl.formatMessage(messages.label_addbookmark);
  return (
    token && (
      <div
        className={cx('bookmark', additionalClassNames, {
          bookmarked: hasBookmark,
        })}
      >
        {isTraining && hasBookmark && (
          <TooltipTrigger>
            <Button
              className="bookmarkButton"
              aria-label={intl.formatMessage(messages.label_addbookmark)}
              onClick={(event) => doToggle(event)}
            >
              <CheckboxIcon />
            </Button>
            <Tooltip layout={'centered'}>
              {intl.formatMessage(messages.label_addbookmark)}
            </Tooltip>
          </TooltipTrigger>
        )}
        {!isTraining && (
          <TooltipTrigger>
            <Button
              className="bookmarkButton"
              aria-label={buttonMessage}
              onClick={(event) => doToggle(event)}
            >
              {hasBookmark ? <CheckboxIcon /> : <TitleIcon />}
            </Button>
            <Tooltip layout={'centered'}>{buttonMessage}</Tooltip>
          </TooltipTrigger>
        )}
      </div>
    )
  );
};

export default injectIntl(Bookmark);
