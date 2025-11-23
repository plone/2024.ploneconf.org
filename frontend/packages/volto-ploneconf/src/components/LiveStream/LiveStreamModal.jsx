import React, { useEffect } from 'react';
import { Modal } from 'semantic-ui-react';
import { Container } from '@plone/components';
import LiveStream from './LiveStream';

const LiveStreamModal = ({ streamInfo, streamModal, setStreamModal }) => {
  const stream_url = streamInfo?.streamInfo;
  const closeModal = () => {
    setStreamModal(false);
  };

  useEffect(() => {
    if (!streamModal && stream_url) {
      setStreamModal(true);
    }
  }, [streamModal, stream_url, setStreamModal]);
  return (
    <Modal
      open={streamModal}
      className={'liveStreamModal'}
      closeIcon
      onClose={() => closeModal()}
    >
      <Container className={'myScheduleLiveStream'}>
        {streamModal && <LiveStream {...streamInfo} displayChat={true} />}
      </Container>
    </Modal>
  );
};

export default LiveStreamModal;
