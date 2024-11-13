import Bookmark from '../../Bookmark/Bookmark';
import SlotIcal from '../SlotIcal/SlotIcal';

const SlotActions = ({ item }) => {
  return (
    <div className="slot-actions">
      <Bookmark item={item} className={'actionItem'} />
      <SlotIcal item={item} className={'actionItem'} />
    </div>
  );
};

export default SlotActions;
