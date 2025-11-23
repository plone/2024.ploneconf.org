import DefaultImageSVG from '@plone/volto/components/manage/Blocks/Listing/default-image.svg';
import { Container } from '@plone/components';
import { Image } from '@plone/volto/components';

const PresenterImage = ({ item }) => {
  const hasImage = item?.image_scales?.image ? true : false;
  return (
    <Container className="presenter-preview-image">
      {hasImage ? (
        <Image
          item={item}
          imageField={'image'}
          alt={item.title}
          className={'presenter-image'}
        />
      ) : (
        <Image
          src={DefaultImageSVG}
          alt="Default image"
          className={'presenter-image'}
        />
      )}
    </Container>
  );
};

export default PresenterImage;
