/**
 * Logo component.
 * @module components/Logo/LogoPloneConf
 */

import { defineMessages, useIntl } from 'react-intl';
import { Image } from 'semantic-ui-react';
import PloneConfLogo from './logo-ploneconf.png';

const messages = defineMessages({
  ploneconf: {
    id: 'Plone Conference',
    defaultMessage: 'Plone Conference',
  },
});

/**
 * LogoPloneConf component class.
 * @function LogoPloneConf
 * @param {Object} intl Intl object
 * @returns {string} Markup of the component.
 */
const LogoPloneConf = ({ className }) => {
  const intl = useIntl();
  return (
    <Image
      src={PloneConfLogo}
      alt={intl.formatMessage(messages.ploneconf)}
      title={intl.formatMessage(messages.ploneconf)}
      className={`logoConf logoPloneConf ${className}`}
      width={'267px'}
      height={'150px'}
    />
  );
};

export default LogoPloneConf;
