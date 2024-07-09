import React from 'react';
import PropTypes from 'prop-types';
import { ConditionalLink, Image } from '@plone/volto/components';
import { flattenToAppURL } from '@plone/volto/helpers';
import DefaultImageSVG from '@plone/volto/components/manage/Blocks/Listing/default-image.svg';
import Links from '../../Links/Links';
import { isInternalURL } from '@plone/volto/helpers/Url/Url';

const ProfilesTemplate = ({ items, linkTitle, linkHref, isEditMode }) => {
  let link = null;
  let href = linkHref?.[0]?.['@id'] || '';

  if (isInternalURL(href)) {
    link = (
      <ConditionalLink to={flattenToAppURL(href)} condition={!isEditMode}>
        {linkTitle || href}
      </ConditionalLink>
    );
  } else if (href) {
    link = <a href={href}>{linkTitle || href}</a>;
  }

  return (
    <>
      <div className="items profiles">
        {items.map((item) => {
          const ItemBodyTemplate = () => {
            const image = item?.image_scales?.image;
            const image_url = image
              ? `${item['@id']}/${image[0].scales.mini.download}`
              : null;
            return (
              <div className="card-container person">
                <div className="person-image-wrapper">
                  {image_url ? (
                    <Image src={image_url} alt="" className="person-image" />
                  ) : (
                    <img
                      src={DefaultImageSVG}
                      alt=""
                      className="person-image"
                    />
                  )}
                </div>
                <div className="item">
                  <div className="content">
                    <h3 className="person-name">{item?.title}</h3>
                    <div className="person-social">
                      {item.links && <Links links={item.links} />}
                    </div>
                  </div>
                </div>
              </div>
            );
          };
          return (
            <div className="listing-person" key={item['@id']}>
              <ConditionalLink item={item} condition={!isEditMode}>
                <ItemBodyTemplate item={item} />
              </ConditionalLink>
            </div>
          );
        })}
      </div>
      {link && <div className="footer">{link}</div>}
    </>
  );
};

ProfilesTemplate.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
  linkMore: PropTypes.any,
  isEditMode: PropTypes.bool,
};

export default ProfilesTemplate;
