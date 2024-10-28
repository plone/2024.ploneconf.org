import { defineMessages } from 'react-intl';

export const messages = defineMessages({
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

export const ROOMS = {
  'auditorio-1': messages['auditorio-1'],
  'auditorio-2': messages['auditorio-2'],
  'sala-2': messages['sala-2'],
  'sala-juri': messages['sala-juri'],
  'sala-x401': messages['sala-x401'],
  'sala-x402': messages['sala-x402'],
};
