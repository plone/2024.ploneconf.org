import React from 'react';
import { formatHour } from '../../helpers/date';
import { Icon } from '@plone/volto/components';
import { defineMessages, useIntl } from 'react-intl';
import SessionCard from './SessionCard';
import SlotCard from './SlotCard';
import lunchSVG from '../../icons/lunch.svg';
import microphoneSVG from '../../icons/microphone.svg';
import trainingSVG from '../../icons/training.svg';
import coffeeSVG from '../../icons/coffee.svg';
import beerSVG from '../../icons/beer.svg';
import meetingSVG from '../../icons/meeting.svg';
import keynoteSVG from '@plone/volto/icons/star.svg';
import registrationSVG from '@plone/volto/icons/finger-print.svg';
import roomSVG from '@plone/volto/icons/map.svg';
import lightingTalksSVG from '@plone/volto/icons/fast-forward.svg';

const messages = defineMessages({
  _all_: {
    id: 'All Rooms',
    defaultMessage: 'All Rooms',
  },
  'auditorio-1': {
    id: 'Jean Ferri Auditorium',
    defaultMessage: 'Jean Ferri Auditorium',
  },
  'auditorio-2': {
    id: 'Dorneles Treméa Auditorium',
    defaultMessage: 'Dorneles Treméa Auditorium',
  },
  'sala-2': {
    id: 'Capibara Room',
    defaultMessage: 'Capibara Room',
  },
  'sala-juri': {
    id: 'Jaguatirica Room',
    defaultMessage: 'Jaguatirica Room',
  },
  'sala-x401': {
    id: 'Buriti Room',
    defaultMessage: 'Buriti Room',
  },
  'sala-x402': {
    id: 'Ipê Room',
    defaultMessage: 'Ipê Room',
  },
});

const ROOMS = {
  'auditorio-1': messages['auditorio-1'],
  'auditorio-2': messages['auditorio-2'],
  'sala-2': messages['sala-2'],
  'sala-juri': messages['sala-juri'],
  'sala-x401': messages['sala-x401'],
  'sala-x402': messages['sala-x402'],
};

const iconDict = {
  registration: registrationSVG,
  Slot: coffeeSVG,
  'coffee-break': coffeeSVG,
  lunch: lunchSVG,
  party: beerSVG,
  meeting: meetingSVG,
  OpenSpace: meetingSVG,
  LightningTalks: lightingTalksSVG,
  Training: trainingSVG,
  Talk: microphoneSVG,
  Keynote: keynoteSVG,
};

const DaySchedule = (props) => {
  const { day } = props;
  const intl = useIntl();
  const keyDay = day['id'];
  const hours = day.items;
  const hasAllRoom = day.rooms.includes('_all_');
  const dayRooms = hasAllRoom ? day.rooms.slice(1) : day.rooms;

  return (
    <div className={`tab-content ${keyDay}`}>
      <div className={`day-header`}>
        <div className="aside-indication">
          <div className="icon-type">
            <Icon name={roomSVG} />
          </div>
        </div>
        <div className="rooms">
          {dayRooms.map((roomId, roomIndex) => {
            const roomLabel = intl.formatMessage(ROOMS[roomId]);
            return (
              <div
                className={`room ${roomId} room-${roomIndex}`}
                key={roomIndex}
              >
                <span className="room-label">{roomLabel}</span>
              </div>
            );
          })}
        </div>
      </div>
      {hours.map((hour, hourIndex) => {
        const time = new Date(hour['id']);
        const rooms = hour['items'];
        const slotType = hour['types'] ? hour.types[0] : 'Talk';
        const icon = iconDict[slotType];
        return (
          <div className={`timeslot`} key={hourIndex}>
            <div className="aside-indication">
              <div className="icon-type">
                <Icon name={icon} />
              </div>
              <div className="time-indication">{formatHour(time)}</div>
            </div>
            <div className="rooms">
              {hasAllRoom && rooms['_all_'] ? (
                <div className={'room-all'}>
                  <SlotCard item={rooms['_all_']} />
                </div>
              ) : (
                dayRooms.map((roomId, roomIndex) => {
                  const slot = rooms?.[roomId];
                  const isSession = slot?.['@type'] !== 'Slot';
                  const Card = slot && isSession ? SessionCard : SlotCard;
                  return (
                    <div
                      className={`room ${roomId} room-${roomIndex}`}
                      key={roomIndex}
                    >
                      {slot ? (
                        <Card item={slot} />
                      ) : (
                        <div className="slot-card empty">{''}</div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DaySchedule;
