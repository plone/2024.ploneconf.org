import { Container } from '@plone/components';

const LiveChat = ({ streamId, stream_domain }) => {
  const src = `https://www.youtube.com/live_chat?v=${streamId}&embed_domain=${stream_domain}`;
  return (
    <Container className={'streamChat column'}>
      <iframe title={'Live Stream'} src={src}></iframe>
    </Container>
  );
};

export default LiveChat;
