/**
 * Language selector component.
 * @module components/Header/LanguageSelector
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { useSelector } from 'react-redux';
import cx from 'classnames';
import { find, map } from 'lodash';
import LogoPloneConf from '../Logo/LogoPloneConf';
import LogoPythonCerrado from '../Logo/LogoPythonCerrado';
import {
  langmap,
  flattenToAppURL,
  toReactIntlLang,
} from '@plone/volto/helpers';

import config from '@plone/volto/registry';
import { defineMessages, useIntl } from 'react-intl';

const messages = defineMessages({
  switchLanguageTo: {
    id: 'Switch to',
    defaultMessage: 'Switch to',
  },
});

const sites = {
  en: {
    title: 'Plone Conference 2024',
    component: LogoPloneConf,
  },
  'pt-br': {
    title: 'Python Cerrado 2024',
    component: LogoPythonCerrado,
  },
};

const LanguageIndicator = ({
  lang,
  translation,
  currentLang,
  onClickAction,
}) => {
  const intl = useIntl();
  const language = sites[lang];
  const LanguageComponent = language.component;
  const title = language.title;
  return (
    <Link
      aria-label={`${intl.formatMessage(messages.switchLanguageTo)} ${langmap[
        lang
      ].nativeName.toLowerCase()}`}
      className={cx({
        selected: toReactIntlLang(lang) === currentLang,
      })}
      to={translation ? flattenToAppURL(translation['@id']) : `/${lang}`}
      title={title}
      onClick={() => {
        onClickAction();
      }}
      key={`language-selector-${lang}`}
    >
      <LanguageComponent className={'switch'} />
    </Link>
  );
};

const LanguageSelector = (props) => {
  const currentLang = useSelector((state) => state.intl.locale);
  const translations = useSelector(
    (state) => state.content.data?.['@components']?.translations?.items,
  );
  const { settings } = config;

  return (
    <div className="site-selector">
      {map(settings.supportedLanguages, (lang) => {
        const translation = find(translations, { language: lang });
        return (
          toReactIntlLang(lang) !== currentLang && (
            <LanguageIndicator
              key={lang}
              lang={lang}
              currentLang={currentLang}
              translation={translation}
              onClickAction={props.onClickAction}
            />
          )
        );
      })}
    </div>
  );
};

LanguageSelector.propTypes = {
  onClickAction: PropTypes.func,
};

LanguageSelector.defaultProps = {
  onClickAction: () => {},
};

export default LanguageSelector;
