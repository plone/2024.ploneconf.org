import SlotDate from '../Session/SlotDate/SlotDate';
import SessionLanguage from '../Session/SessionLanguage/SessionLanguage';
import SessionRoom from '../Session/SessionRoom/SessionRoom';

const SlotInfo = ({ item, shortDate }) => {
  return (
    <div className="slot-info">
      <SlotDate
        item={item}
        shortFormat={shortDate}
        className={'slotInfoItem'}
      />
      <SessionRoom item={item} className={'slotInfoItem'} />
      <SessionLanguage item={item} className={'slotInfoItem'} />
    </div>
  );
};

export default SlotInfo;
