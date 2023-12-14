/**
 * Sponsor container.
 * @module components/Sponsors/Sponsor
 */
import React from 'react';

import { flattenToAppURL } from '@plone/volto/helpers';

/**
 * Sponsor function.
 * @function Sponsor
 * @returns {JSX.Element} Markup of the a Sponsor option.
 */
function Sponsor({ content }) {
  const sponsorId = content.id;
  const remoteUrl = content.remoteUrl;
  const title = content.title;
  const level = content.level;
  return (
    <div id={sponsorId} className={`sponsor ${level}`}>
      <a
        href={remoteUrl}
        className="link"
        title={title}
        target="_blank"
        rel="noreferrer"
      >
        <img
          title={content.title}
          alt={content.title}
          src={flattenToAppURL(content.image.download)}
        />
      </a>
    </div>
  );
}

export default Sponsor;
