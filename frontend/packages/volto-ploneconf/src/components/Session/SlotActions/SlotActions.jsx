import Bookmark from '../../Bookmark/Bookmark';
import SlotLiveStream from '../../LiveStream/SlotLiveStream';
import SlotIcal from '../SlotIcal/SlotIcal';
import cx from 'classnames';

const SlotActions = ({ item, displayIcal, streamAction }) => {
  return (
    <div className="slot-actions">
      <Bookmark item={item} className={'actionItem'} />
      <SlotLiveStream
        item={item}
        className={'actionItem'}
        action={streamAction}
      />
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
