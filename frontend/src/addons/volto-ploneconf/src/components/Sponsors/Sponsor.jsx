/**
 * Sponsor container.
 * @module components/Sponsors/Sponsor
 */
import React from 'react';
import { UniversalLink } from '@plone/volto/components';
import { flattenToAppURL } from '@plone/volto/helpers';

/**
 * Sponsor function.
 * @function Sponsor
 * @returns {JSX.Element} Markup of the a Sponsor option.
 */
function Sponsor({ content }) {
  const sponsorId = content.id;
  const level = content.level;
  return (
    <div id={sponsorId} className={`sponsor ${level}`}>
      <UniversalLink href={flattenToAppURL(content['@id'])}>
        <img
          title={content.title}
          alt={content.title}
          src={flattenToAppURL(content.image.download)}
        />
      </UniversalLink>
    </div>
  );
}

export default Sponsor;
