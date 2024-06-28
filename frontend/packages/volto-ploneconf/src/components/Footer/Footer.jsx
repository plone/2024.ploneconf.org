// SemanticUI-free pre-@plone/components
import React from 'react';

import { FormattedMessage, injectIntl } from 'react-intl';
import { useSelector, shallowEqual } from 'react-redux';
import { UniversalLink } from '@plone/volto/components';
import Container from '@kitconcept/volto-light-theme/components/Atoms/Container/Container';
import { flattenToAppURL } from '@plone/volto/helpers';
import FooterLinks from '@plonegovbr/volto-network-block/components/FooterLinks/FooterLinks';

const allSiteActions = {
  en: [
    { id: 'contact', title: 'Contact', url: '/en/about/contact' },
    {
      id: 'code-of-conduct',
      title: 'Code of Conduct',
      url: '/en/about/code-of-conduct',
    },
  ],
  'pt-BR': [
    { id: 'contact', title: 'Fale Conosco', url: '/pt-br/sobre/contato' },
    {
      id: 'code-of-conduct',
      title: 'Código de Conduta',
      url: '/pt-br/sobre/codigo-de-conduta',
    },
  ],
};

/**
 * Component to display the footer.
 * @function Footer
 * @param {Object} intl Intl object
 * @returns {string} Markup of the component
 */
const Footer = ({ intl }) => {
  const { lang = [] } = useSelector(
    (state) => ({
      lang: state.intl.locale,
    }),
    shallowEqual,
  );
  const siteActions = lang ? allSiteActions[lang] : [];
  return (
    <footer id="footer">
      <div className="footerDecoration"></div>
      <Container layout className="footer">
        <FooterLinks />
        <ul>
          {/* wrap in div for a11y reasons: listitem role cannot be on the <a> element directly */}
          {siteActions?.length
            ? siteActions.map((item) => (
                <li className="item" key={item.id}>
                  <UniversalLink
                    className="item"
                    href={flattenToAppURL(item.url)}
                  >
                    {item?.title}
                  </UniversalLink>
                </li>
              ))
            : null}
        </ul>
      </Container>
      <Container layout className="signature">
        <a className="item powered-by" href="https://plone.org">
          <FormattedMessage
            id="This site is built using Python and Plone."
            defaultMessage="This site is built using Python and Plone"
          />
        </a>
      </Container>
    </footer>
  );
};

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
Footer.propTypes = {
  /**
   * i18n object
   */
};

export default injectIntl(Footer);
