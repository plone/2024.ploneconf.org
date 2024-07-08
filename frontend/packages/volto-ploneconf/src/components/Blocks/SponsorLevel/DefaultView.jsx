import React, { useEffect, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { getNavroot } from '@plone/volto/actions';
import { useSelector, useDispatch } from 'react-redux';
import { UniversalLink } from '@plone/volto/components';
import {
  hasApiExpander,
  getBaseUrl,
  toBackendLang,
  flattenToAppURL,
  toPublicURL,
} from '@plone/volto/helpers';
import { FormattedMessage } from 'react-intl';
import { listSponsors } from '../../../actions';
import Sponsor from '../../Sponsors/Sponsor';

const messages = defineMessages({
  sponsor: {
    id: 'Sponsor Us',
    defaultMessage: 'Sponsor Us',
  },
});

const formLocation = {
  en: '/en/sponsors/sponsor',
  'pt-br': '/pt-br/patrocinio/patrocine',
};

const SponsorLevelView = (props) => {
  const { properties, data } = props;
  const level_id = properties['id'];
  const dispatch = useDispatch();
  const lang = useSelector((state) => state.intl.locale);
  const loading = useSelector((state) => state.sponsors.loading);
  const levels = useSelector((state) => state.sponsors.levels);
  const navroot = useSelector((state) => state.navroot?.data?.navroot?.['@id']);
  const pathname = properties.pathname;
  const intl = useIntl();
  useEffect(() => {
    if (!hasApiExpander('navroot', getBaseUrl(pathname))) {
      dispatch(getNavroot(getBaseUrl(pathname)));
    }
  }, [dispatch, pathname]);

  const [sponsors, setSponsors] = useState([]);
  useEffect(() => {
    if (navroot !== undefined) {
      dispatch(listSponsors(flattenToAppURL(navroot)));
    }
  }, [dispatch, navroot]);
  useEffect(() => {
    if (levels) {
      const level = levels.filter((item) => item.id === level_id);
      if (level.length === 1) {
        setSponsors(level[0].items);
      }
    }
  }, [level_id, levels, sponsors]);
  const urlAction = data?.href
    ? data.href[0]['@id']
    : toPublicURL(formLocation[toBackendLang(lang)]);
  const hasSponsors = sponsors.length > 0;
  const displayCTA = data?.displayCTA ? data.displayCTA : sponsors.length === 0;
  return (
    <div className="block sponsorLevel">
      {!loading && (
        <>
          {hasSponsors && (
            <>
              <div className="sponsorLevelHeader">
                <span className="sponsorLevelTitle">
                  {data?.title ? (
                    data.title
                  ) : (
                    <FormattedMessage id="Sponsors" defaultMessage="Sponsors" />
                  )}
                </span>
              </div>
              <div className="sponsorList">
                {sponsors.map(function (sponsor, i) {
                  return <Sponsor content={sponsor} key={i} />;
                })}
              </div>
            </>
          )}

          {displayCTA && (
            <div className="sponsorCTA">
              <UniversalLink
                href={urlAction}
                title={intl.formatMessage(messages.sponsor)}
                className={'cta'}
              >
                {data?.label ? (
                  data.label
                ) : (
                  <FormattedMessage
                    id="Be the First!"
                    defaultMessage="Be the First!"
                  />
                )}
              </UniversalLink>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SponsorLevelView;
