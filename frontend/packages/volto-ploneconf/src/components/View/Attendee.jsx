import React from 'react';
import { Container } from '@plone/components';
import { Grid } from 'semantic-ui-react';
import { flattenToAppURL } from '@plone/volto/helpers';
import DefaultImageSVG from '@plone/volto/components/manage/Blocks/Listing/default-image.svg';
import Links from '../Links/Links';
import AttendeeLabel from '../AttendeeLabel/AttendeeLabel';
import AttendeeManagement from '../AttendeeManagement/AttendeeManagement';

const Attendee = ({ location, content }) => {
  const { title, description, links } = content;
  const { pathname } = location;
  return (
    <Container narrow className="attendee-view">
      <AttendeeLabel label={content.review_state} />
      <Grid columns={2} stackable className={'attendee-info'}>
        <Grid.Column width={3} className="attendee-card-wrapper">
          <div className="attendee-preview-image no-filter">
            {content.image ? (
              <img
                src={flattenToAppURL(content.image.scales.preview.download)}
                alt={content.image_caption}
              />
            ) : (
              <img src={DefaultImageSVG} alt="" />
            )}
          </div>
          <div className="attendee-social">
            {links && <Links links={links} />}
          </div>
        </Grid.Column>
        <Grid.Column width={9}>
          <h1 className="attendee-name">{title}</h1>
          <p className="attendee-description">{description}</p>
          {content.text && (
            <div
              dangerouslySetInnerHTML={{
                __html: content.text.data,
              }}
            />
          )}
        </Grid.Column>
      </Grid>
      {content.eventbrite?.event_id && (
        <AttendeeManagement content={content} pathname={pathname} />
      )}
    </Container>
  );
};

export default Attendee;
