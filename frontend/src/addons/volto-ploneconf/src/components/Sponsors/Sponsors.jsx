/**
 * Sponsors container.
 * @module components/Sponsors/Sponsors
 */
import React, { useEffect } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { listSponsors } from '../../actions';
import { useSelector, useDispatch } from 'react-redux';
import SponsorLevel from './SponsorLevel';

/**
 * Sponsor function.
 * @function Sponsors
 * @returns {JSX.Element} Markup of the a Sponsor option.
 */
function Sponsors({ navRoot }) {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.sponsors.loading);
  const levels = useSelector((state) => state.sponsors.levels);

  useEffect(() => {
    dispatch(listSponsors(navRoot !== undefined ? navRoot : '/'));
  }, [dispatch, navRoot]);
  return (
    <div className="sponsors">
      {!loading && levels && (
        <>
          <h2 className="title">
            <FormattedMessage id="Sponsors" defaultMessage="Sponsors" />
          </h2>
          {levels.map(function (sponsorLevel, i) {
            return (
              <SponsorLevel
                levelId={sponsorLevel.id}
                title={sponsorLevel.title}
                sponsors={sponsorLevel.items}
                displayTitle={true}
                key={i}
              />
            );
          })}
        </>
      )}
    </div>
  );
}

export default injectIntl(Sponsors);
