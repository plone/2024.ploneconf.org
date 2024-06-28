// SemanticUI-free pre-@plone/components
import PropTypes from 'prop-types';
import Container from '@kitconcept/volto-light-theme/components/Atoms/Container/Container';
import MobileNavigation from '@kitconcept/volto-light-theme/components/MobileNavigation/MobileNavigation';
import Logo from '../Logo/Logo';
import LanguageSelector from './LanguageSelector';
import { Navigation } from '@plone/volto/components';

const Header = (props) => {
  const { pathname } = props;

  return (
    <header className="header-wrapper">
      <Container layout>
        <div className="header">
          <div className="logo-nav-wrapper">
            <div className="logo">
              <Logo />
            </div>
            <Navigation pathname={pathname} />
            <MobileNavigation pathname={pathname} />
            <LanguageSelector />
          </div>
        </div>
      </Container>
    </header>
  );
};

Header.propTypes = {
  token: PropTypes.string,
  pathname: PropTypes.string.isRequired,
};

Header.defaultProps = {
  token: null,
};

export default Header;
