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
    <Container narrow className="person-view">
      <Container className="person-labels">
        {content.labels &&
          content.labels.map((label, idx) => {
            return <PersonLabel label={label} key={idx} />;
          })}
      </Container>
      <Grid columns={2} stackable className={'person-info'}>
        <Grid.Column width={4} className="speaker-image-wrapper">
          <div className="speakers-preview-image no-filter">
            {content.image ? (
              <img
                src={flattenToAppURL(content.image.scales.preview.download)}
                alt={content.image_caption}
              />
            ) : (
              <img src={DefaultImageSVG} alt="" />
            )}
          </div>
          <div className="person-social">
            {links && <Links links={links} />}
          </div>
        </Grid.Column>
        <Grid.Column width={8}>
          <h1 className="person-name">{title}</h1>
          <p className="person-description">{description}</p>
          {content.text && (
            <div
              dangerouslySetInnerHTML={{
                __html: content.text.data,
              }}
            />
          )}
          <div className="person-content">
            {content?.activities?.length > 0 && (
              <div className="person-activities">
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
                          <div className="person-activity" key={idx}>
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
      <Container className="person-content">
        {content?.activities?.length > 0 && (
          <Container className="person-activities">
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
                      <div className="person-activity" key={idx}>
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
                          />
                        </Link>
                      </div>
                    ))}
                  </Tab.Pane>
                ),
              }))}
            />
          </Container>
        )}
      </Container>
    </Container>
  );
};

export default Person;
