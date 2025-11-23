import React from 'react';
import PropTypes from 'prop-types';
import { Container } from '@plone/components';
import { ConditionalLink } from '@plone/volto/components';
import { flattenToAppURL } from '@plone/volto/helpers';
import PresenterInfo from '../../PresenterInfo/PresenterInfo';
import { isInternalURL } from '@plone/volto/helpers/Url/Url';

const ProfilesTemplate = ({ items, linkTitle, linkHref, isEditMode }) => {
  let link = null;
  let href = linkHref?.[0]?.['@id'] || '';

  if (isInternalURL(href)) {
    link = (
      <ConditionalLink to={flattenToAppURL(href)} condition={!isEditMode}>
        {linkTitle || href}
      </ConditionalLink>
    );
  } else if (href) {
    link = <a href={href}>{linkTitle || href}</a>;
  }

  return (
    <>
      <Container className="items profiles">
        {items.map((item) => {
          return (
            <Container className="listing-presenter" key={item['@id']}>
              <PresenterInfo item={item} isEditMode={isEditMode} />
            </Container>
          );
        })}
      </Container>
      {link && <Container className="footer">{link}</Container>}
    </>
  );
};

ProfilesTemplate.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
  linkMore: PropTypes.any,
  isEditMode: PropTypes.bool,
};

export default ProfilesTemplate;
