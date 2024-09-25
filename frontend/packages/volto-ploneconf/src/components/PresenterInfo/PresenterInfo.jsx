import React from 'react';
import { Container } from '@plone/components';
import { ConditionalLink } from '@plone/volto/components';
import Links from '../Links/Links';
import PresenterImage from './PresenterImage';

const PresenterInfo = ({ item, isEditMode }) => {
  return (
    <ConditionalLink item={item} condition={!isEditMode}>
      <Container className="card-container person">
        <Container className="presenter-image-wrapper">
          <PresenterImage item={item} />
        </Container>
        <Container className="item">
          <Container className="content">
            <Container className="presenter-name-wrapper">
              <h3 className="presenter-name">{item?.title}</h3>
            </Container>
            <Container className="presenter-social">
              {item.links && <Links links={item.links} />}
            </Container>
          </Container>
        </Container>
      </Container>
    </ConditionalLink>
  );
};

export default PresenterInfo;
