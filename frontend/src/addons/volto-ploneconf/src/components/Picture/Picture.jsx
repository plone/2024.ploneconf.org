import React from 'react';
import { Image } from 'semantic-ui-react';
import config from '@plone/volto/registry';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { flattenToAppURL } from '@plone/volto/helpers';

const Picture = ({
  imageBase,
  alt,
  source,
  lazy = true,
  content,
  className,
  ...props
}) => {
  const pictureOptions = config.settings.pictureOptions;
  let sources = [];
  const scales = content?.image_scales?.image?.[0]?.scales || null;
  if (Object.keys(pictureOptions).includes(source)) {
    sources = pictureOptions[source];
  } else {
    sources = pictureOptions[Object.keys(pictureOptions)[0]];
  }
  return (
    imageBase && (
      <picture className={className}>
        {sources.map((source, key) => {
          return (
            <source
              key={key}
              media={source.media}
              width={scales ? scales[source.image]?.width : null}
              height={scales ? scales[source.image]?.height : null}
              srcSet={
                scales
                  ? flattenToAppURL(
                      `${content['@id']}/${
                        scales[source.image]?.download ||
                        content?.image_scales?.image?.[0]?.download
                      }`,
                    )
                  : `${imageBase}/${source.image}`
              }
            />
          );
        })}
        {lazy ? (
          <LazyLoadImage
            alt={alt}
            src={`${imageBase}/large`}
            className="ui image"
            width={content ? '100%' : null}
            height={content ? 'auto' : null}
          />
        ) : (
          <Image
            alt={alt}
            src={`${imageBase}/teaser`}
            width={content ? '100%' : null}
            height={content ? 'auto' : null}
          />
        )}
      </picture>
    )
  );
};

export default Picture;
