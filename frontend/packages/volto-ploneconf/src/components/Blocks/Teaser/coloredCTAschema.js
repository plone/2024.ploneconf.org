import { defineMessages } from 'react-intl';
const messages = defineMessages({
  subtitle: {
    id: 'subtitle',
    defaultMessage: 'Subtitle',
  },

  cta: {
    id: 'CTA',
    defaultMessage: 'CTA',
  },
  color: {
    id: 'color',
    defaultMessage: 'Color',
  },
});

export const ColoredCTAEnhancer = (props) => {
  const { intl, schema } = props;
  const fieldsToRemove = [
    'head_title',
    'preview_image',
    'align',
    'backgroundColor',
  ];
  return {
    ...schema,
    fieldsets: [
      {
        ...schema.fieldsets[0],
        fields: [
          ...schema.fieldsets[0].fields.filter(
            (f) => !fieldsToRemove.includes(f),
          ),
          'subtitle',
          'cta',
          'color',
        ],
      },
      {
        ...schema.fieldsets[1],
      },
    ],
    properties: {
      ...schema.properties,
      subtitle: {
        title: intl.formatMessage(messages.subtitle),
      },
      color: {
        title: intl.formatMessage(messages.color),
        choices: [
          ['primary', 'primary'],
          ['secondary', 'secondary'],
          ['tertiary', 'tertiary'],
        ],
      },
      cta: {
        title: intl.formatMessage(messages.cta),
      },
    },
  };
};
