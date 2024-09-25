import React from 'react';
import { Container } from '@plone/components';
import { Tab, Grid } from 'semantic-ui-react';
import { flattenToAppURL } from '@plone/volto/helpers';
import { Link } from 'react-router-dom';
import DefaultImageSVG from '@plone/volto/components/manage/Blocks/Listing/default-image.svg';
import ScheduleInfo from '../Session/ScheduleInfo/ScheduleInfo';
import SessionInfo from '../Session/SessionInfo/SessionInfo';
import PersonLabel from '../PersonLabel/PersonLabel.jsx';
import Links from '../Links/Links';

const Person = ({ content }) => {
  const { title, description, links } = content;
  return (
    <Container narrow className="presenter-view">
      <Grid columns={2} stackable className={'presenter-info'}>
        <Grid.Column width={4} className="presenter-card-wrapper">
          <div className="presenter-preview-image no-filter">
            {content.image ? (
              <img
                src={flattenToAppURL(content.image.scales.preview.download)}
                alt={content.image_caption}
              />
            ) : (
              <img src={DefaultImageSVG} alt="" />
            )}
          </div>
          <div className="presenter-social">
            {links && <Links links={links} />}
          </div>
        </Grid.Column>
        <Grid.Column width={8}>
          <h1 className="presenter-name">{title}</h1>
          <Container className="presenter-labels">
            {content.labels &&
              content.labels.map((label, idx) => {
                return <PersonLabel label={label} key={idx} />;
              })}
          </Container>
          <p className="presenter-description">{description}</p>
          {content.text && (
            <div
              dangerouslySetInnerHTML={{
                __html: content.text.data,
              }}
            />
          )}
          <div className="presenter-content">
            {content?.activities?.length > 0 && (
              <div className="presenter-activities">
                <Tab
                  menu={{
                    secondary: true,
                    pointing: true,
                    attached: true,
                    tabular: true,
                    className: 'formtabs',
                  }}
                  className="tabs-wrapper"
                  renderActiveOnly={false}
                  panes={content?.activities?.map((activity) => ({
                    menuItem: activity['@type'],
                    pane: (
                      <Tab.Pane key={activity['@type']}>
                        {activity?.items?.map((item, idx) => (
                          <div className="presenter-activity" key={idx}>
                            <Link to={flattenToAppURL(item['@id'])}>
                              <h2>{item.title}</h2>
                              <ScheduleInfo
                                start={item.start}
                                end={item.end}
                                track={item.track}
                              />
                              <SessionInfo
                                audience={item.audience}
                                level={item.level}
                                description={item.description}
                              />
                            </Link>
                          </div>
                        ))}
                      </Tab.Pane>
                    ),
                  }))}
                />
              </div>
            )}
          </div>
        </Grid.Column>
      </Grid>
    </Container>
  );
};

export default Person;
