import { Icon } from '@plone/volto/components';
import targetSVG from '@plone/volto/icons/target.svg';

const SessionAudience = ({ item }) => {
  const audienceInfo = item.audience?.length > 0 ? item.audience : null;
  return (
    audienceInfo && (
      <div className="session-audience">
        <Icon name={targetSVG} className={'categoryIcon'} />
        {audienceInfo.map((audienceItem, index) => {
          const audienceToken = audienceItem.token;
          const audienceTitle = audienceItem.title;
          return (
            <div className={`audience ${audienceToken}`} key={index}>
              {audienceTitle}
            </div>
          );
        })}
      </div>
    )
  );
};

export default SessionAudience;
