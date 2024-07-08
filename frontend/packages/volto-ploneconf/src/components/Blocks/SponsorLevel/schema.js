import { defineMessages } from 'react-intl';

const messages = defineMessages({
  blockTitle: {
    id: 'Sponsor Level',
    defaultMessage: 'Sponsor Level',
  },
  title: {
    id: 'Title',
    defaultMessage: 'Title',
  },
  cta: {
    id: 'Sponsorship Form',
    defaultMessage: 'Sponsorship Form',
  },
  displayCTA: {
    id: 'Display CTA?',
    defaultMessage: 'Display CTA?',
  },
  ctaLabel: {
    id: 'CTA Label',
    defaultMessage: 'CTA Label',
  },
});

export const sponsorLevelSchema = (props) => {
  return {
    title: props.intl.formatMessage(messages.blockTitle),
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['title'],
      },
      {
        id: 'cta',
        title: 'CTA',
        fields: ['displayCTA', 'href', 'label'],
      },
    ],
    properties: {
      title: {
        title: props.intl.formatMessage(messages.title),
      },
      href: {
        title: props.intl.formatMessage(messages.cta),
        widget: 'object_browser',
        mode: 'link',
        selectedItemAttrs: [
          'Title',
          'head_title',
          'Description',
          'hasPreviewImage',
          'image_field',
          'image_scales',
          '@type',
        ],
        allowExternals: true,
      },
      displayCTA: {
        title: props.intl.formatMessage(messages.displayCTA),
        type: 'boolean',
      },
      label: {
        title: props.intl.formatMessage(messages.ctaLabel),
      },
    },
    required: ['title'],
  };
};
