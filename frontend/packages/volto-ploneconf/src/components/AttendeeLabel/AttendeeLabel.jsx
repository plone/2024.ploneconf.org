import React from 'react';
import { useIntl } from 'react-intl';
import { messages } from './labels';

const AttendeeLabel = ({ label }) => {
  const intl = useIntl();
  const token = label?.token ? label.token : label;
  const title = label?.title
    ? label.title
    : intl.formatMessage(messages[label]);
  return (
    <div className={'attendeeLabelWrapper'}>
      <span className={`attendeeLabel ${token}`}>{title}</span>
    </div>
  );
};

export default AttendeeLabel;
