import { Icon } from '@plone/volto/components';
import levelSVG from '@plone/volto/icons/vertical.svg';

const SessionLevel = ({ item }) => {
  const levelInfo = item.level?.length > 0 ? item.level : null;
  return (
    levelInfo && (
      <div className="session-level">
        <Icon name={levelSVG} className={'categoryIcon'} />
        {levelInfo.map((levelItem, index) => {
          const levelToken = levelItem.token;
          const levelTitle = levelItem.title;
          return (
            <div className={`level ${levelToken}`} key={index}>
              {levelTitle}
            </div>
          );
        })}
      </div>
    )
  );
};

export default SessionLevel;
