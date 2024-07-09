/**
 * ScheduleInfo component.
 * @module components/ScheduleInfo/ScheduleInfo
 */

import React from 'react';
import { Label } from 'semantic-ui-react';
import { Icon } from '@plone/volto/components';
import { When } from '@plone/volto/components/theme/View/EventDatesInfo';
import calendarSVG from '@plone/volto/icons/calendar.svg';
import PropTypes from 'prop-types';
import { flattenToAppURL } from '@plone/volto/helpers';

const ScheduleInfo = (props) => {
  const start = props.start;
  const end = props.end;
  const track = props.track;
  return (
    <div className={'session-schedule'}>
      {start && (
        <Label.Group className={'session-schedule-date'}>
          <strong>Date:</strong>{' '}
          <Label>
            <When start={start} end={end} whole_day={false} open_end={false} />
          </Label>{' '}
          {props.url && (
            <a href={`/++api++${flattenToAppURL(props.url)}/@@ical_view`}>
              <Icon name={calendarSVG} size={'20px'} />
            </a>
          )}
        </Label.Group>
      )}
      {track?.length > 0 && (
        <Label.Group className={'talk-schedule-track'}>
          <strong>Track:</strong>{' '}
          {track.map((item) => (
            <Label key={item.token} className={`track-${item.token}`}>
              {item.title}
            </Label>
          ))}
        </Label.Group>
      )}
    </div>
  );
};

ScheduleInfo.propTypes = {
  track: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      token: PropTypes.string,
    }),
  ),
  end: PropTypes.string,
  start: PropTypes.string,
  url: PropTypes.string,
};

export default ScheduleInfo;
