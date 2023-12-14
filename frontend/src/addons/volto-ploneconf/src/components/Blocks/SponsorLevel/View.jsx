/**
 * Sponsors block.
 * @module components/Blocks/SponsorsLevel/View
 */
import React, { useEffect, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { getNavroot } from '@plone/volto/actions';
import { useSelector, useDispatch } from 'react-redux';
import { UniversalLink } from '@plone/volto/components';
import {
  hasApiExpander,
  getBaseUrl,
  toBackendLang,
  flattenToAppURL,
  toPublicURL,
  withBlockExtensions,
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

/**
 * View document block class.
 * @class View
 * @extends Component
 */
const View = (props) => {
  const { properties } = props;
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

  const urlAction = toPublicURL(formLocation[toBackendLang(lang)]);

  return (
    <div className="block sponsorLevel">
      {!loading && (
        <div className="sponsorList">
          {sponsors.length === 0 ? (
            <UniversalLink
              href={`${urlAction}`}
              title={intl.formatMessage(messages.sponsor)}
            >
              <h3>
                <FormattedMessage
                  id="Be the First!"
                  defaultMessage="Be the First!"
                />
              </h3>
            </UniversalLink>
          ) : (
            sponsors.map(function (sponsor, i) {
              return <Sponsor content={sponsor} key={i} />;
            })
          )}
        </div>
      )}
    </div>
  );
};

View.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  properties: PropTypes.objectOf(PropTypes.any).isRequired,
  block: PropTypes.string,
};

export default withBlockExtensions(View);
