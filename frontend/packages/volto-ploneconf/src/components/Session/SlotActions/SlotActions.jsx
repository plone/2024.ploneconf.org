import Bookmark from '../../Bookmark/Bookmark';
import SlotIcal from '../SlotIcal/SlotIcal';
import cx from 'classnames';

const SlotActions = ({ item, displayIcal }) => {
  return (
    <div className="slot-actions">
      <Bookmark item={item} className={'actionItem'} />
      <SlotIcal
        item={item}
        className={cx('actionItem', {
          hideItem: !displayIcal,
        })}
      />
    </div>
  );
};

export default SlotActions;
