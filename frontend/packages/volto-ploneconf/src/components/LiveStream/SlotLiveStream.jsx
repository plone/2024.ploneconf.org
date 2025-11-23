import { defineMessages, useIntl } from 'react-intl';
import { UniversalLink } from '@plone/volto/components';
import { Button, Tooltip, VideoIcon } from '@plone/components';
import { TooltipTrigger } from 'react-aria-components';

const messages = defineMessages({
  watchStream: {
    id: 'Watch Stream',
    defaultMessage: 'Watch Stream',
  },
});

const SlotLiveStream = ({ item, className, action }) => {
  const additionalClassNames = className ? className : '';
  const intl = useIntl();
  const { stream_url, stream_domain } = item;
  const streamInfo = {
    stream_domain: stream_domain,
    stream_url: stream_url,
  };
  const href = `${item['@id']}#livestream`;
  return (
    stream_url && (
      <div className={`slotLiveStream ${additionalClassNames}`}>
        <TooltipTrigger delay={0}>
          {action ? (
            <Button
              className="liveStreamButton"
              aria-label={intl.formatMessage(messages.watchStream)}
              onPress={() => action(streamInfo)}
            >
              <VideoIcon />
            </Button>
          ) : (
            <UniversalLink href={href}>
              <Button
                className="liveStreamButton"
                aria-label={intl.formatMessage(messages.watchStream)}
              >
                <VideoIcon />
              </Button>
            </UniversalLink>
          )}
          <Tooltip layout={'centered'}>
            {intl.formatMessage(messages.watchStream)}
          </Tooltip>
        </TooltipTrigger>
      </div>
    )
  );
};

export default SlotLiveStream;
