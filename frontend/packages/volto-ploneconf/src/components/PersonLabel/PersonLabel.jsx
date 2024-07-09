import React from 'react';
import { useIntl, defineMessages } from 'react-intl';

const messages = defineMessages({
  'pf-member': {
    id: 'pf-member',
    defaultMessage: 'Plone Foundation Member',
  },
  'keynote-speaker': {
    id: 'keynote-speaker',
    defaultMessage: 'Keynote Speaker',
  },
  speaker: {
    id: 'speaker',
    defaultMessage: 'Speaker',
  },
  instructor: {
    id: 'instructor',
    defaultMessage: 'Instructor',
  },
});

const PersonLabel = ({ label, short }) => {
  const intl = useIntl();
  const token = label?.token ? label.token : label;
  const title = label?.title
    ? label.title
    : intl.formatMessage(messages[label]);
  return <span className={`personLabel ${token}`}>{short ? ' ' : title}</span>;
};

export default PersonLabel;
