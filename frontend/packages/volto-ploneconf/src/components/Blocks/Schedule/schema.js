import { defineMessages } from 'react-intl';

const messages = defineMessages({
  blockTitle: {
    id: 'Schedule Block',
    defaultMessage: 'Schedule Block',
  },
  displayMenuHeadline: {
    id: 'Display Headline?',
    defaultMessage: 'Display Headline?',
  },
  filterByDay: {
    id: 'Filter by Day',
    defaultMessage: 'Filter by Day',
  },
});

export const scheduleSchema = (props) => {
  return {
    title: props.intl.formatMessage(messages.blockTitle),
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['displayDayIndex', 'filter'],
      },
    ],
    properties: {
      displayDayIndex: {
        title: props.intl.formatMessage(messages.displayMenuHeadline),
        default: true,
        type: 'boolean',
      },
      filter: {
        title: props.intl.formatMessage(messages.filterByDay),
        isMulti: true,
        default: [],
        choices: [
          ['2024-11-25', '25 Nov'],
          ['2024-11-26', '26 Nov'],
          ['2024-11-27', '27 Nov'],
          ['2024-11-28', '28 Nov'],
          ['2024-11-29', '29 Nov'],
        ],
      },
    },
    required: [],
  };
};
