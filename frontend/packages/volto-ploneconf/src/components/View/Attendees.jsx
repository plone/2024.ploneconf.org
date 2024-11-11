import React from 'react';
import { Container } from '@plone/components';
import { useSelector } from 'react-redux';
import { getBaseUrl, userHasRoles } from '@plone/volto/helpers';
import RenderBlocks from '@plone/volto/components/theme/View/RenderBlocks';

const Attendees = (props) => {
  const { content, location } = props;
  const { title, description } = content;
  const path = getBaseUrl(location?.pathname || '');
  const user = useSelector((state) => state.users.user);
  const showBlocks = userHasRoles(user, [
    'Site Administrator',
    'Manager',
    'Reviewer',
  ]);
  return (
    <Container
      narrow
      id="page-document"
      className="view-wrapper attendees-view"
    >
      {showBlocks ? (
        <RenderBlocks {...props} path={path} />
      ) : (
        <>
          <h1 className="documentFirstHeading">{title}</h1>
          {description && <p className="documentDescription">{description}</p>}
        </>
      )}
    </Container>
  );
};

export default Attendees;
