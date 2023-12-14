/**
 * Logo component.
 * @module components/Logo/LogoPythonCerrado
 */

import { defineMessages, useIntl } from 'react-intl';
import { Image } from 'semantic-ui-react';
import PythonCerradoLogo from './logo-pythoncerrado.png';

const messages = defineMessages({
  pythoncerrado: {
    id: 'Python Cerrado',
    defaultMessage: 'Python Cerrado',
  },
});

/**
 * LogoPythonCerrado component class.
 * @function LogoPythonCerrado
 * @param {Object} intl Intl object
 * @returns {string} Markup of the component.
 */
const LogoPythonCerrado = ({ className }) => {
  const intl = useIntl();
  return (
    <Image
      src={PythonCerradoLogo}
      alt={intl.formatMessage(messages.pythoncerrado)}
      title={intl.formatMessage(messages.pythoncerrado)}
      className={`logoConf logoPythonCerrado ${className}`}
      width={'267px'}
      height={'150px'}
    />
  );
};

export default LogoPythonCerrado;
