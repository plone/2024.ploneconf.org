import { Image } from '@plone/volto/components';
import flagEN from './en.png';
import flagPT from './pt-br.png';
import flagUN from './un.png';

const FLAGS = {
  en: flagEN,
  'pt-br': flagPT,
  un: flagUN,
};

const SessionLanguage = ({ item }) => {
  const language = item.session_language?.[0]
    ? item.session_language[0]
    : item.session_language;
  const flag = language ? FLAGS[language.token] : FLAGS['un'];
  const alt = language
    ? `Content to be presented in ${language.token}`
    : `Content is language independent`;
  return (
    <div className="session-language">
      <Image src={flag} alt={alt} className={'language-flag'} />
    </div>
  );
};

export default SessionLanguage;
