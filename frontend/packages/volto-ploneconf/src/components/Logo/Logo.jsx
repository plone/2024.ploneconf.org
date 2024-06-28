/**
 * Logo component.
 * @module components/theme/Logo/Logo
 */
import { defineMessages, useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { UniversalLink } from '@plone/volto/components';
import { toBackendLang } from '@plone/volto/helpers';
import LogoPloneConf from './LogoPloneConf';
import LogoPythonCerrado from './LogoPythonCerrado';

const messages = defineMessages({
  frontpage: {
    id: 'Front Page',
    defaultMessage: 'Front Page',
  },
});

/**
 * Logo component class.
 * @function Logo
 * @param {Object} intl Intl object
 * @returns {string} Markup of the component.
 */
const Logo = () => {
  const lang = useSelector((state) => state.intl.locale);
  const intl = useIntl();
  return (
    <UniversalLink
      href={`/${toBackendLang(lang)}`}
      title={intl.formatMessage(messages.frontpage)}
    >
      {lang === 'en' ? (
        <LogoPloneConf className={'main'} />
      ) : (
        <LogoPythonCerrado className={'main'} />
      )}
    </UniversalLink>
  );
};

export default Logo;
