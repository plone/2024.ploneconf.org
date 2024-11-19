import { Container } from '@plone/components';
import LiveChat from './LiveChat';

const LiveStream = ({ stream_url, stream_domain, displayChat }) => {
  const streamId = stream_url.match(/.be\//)
    ? stream_url.match(/^.*\.be\/(.*)/)[1]
    : stream_url.match(/^.*\?v=(.*)$/)[1];
  return (
    <Container className={'streamContainer'}>
      <Container className={'stream column'}>
        <iframe
          title={'Live Stream'}
          src={`//www.youtube.com/embed/${streamId}`}
          frameborder="0"
          allowfullscreen
          class="video"
        />
      </Container>
      {displayChat && (
        <LiveChat streamId={streamId} stream_domain={stream_domain} />
      )}
    </Container>
  );
};

export default LiveStream;
