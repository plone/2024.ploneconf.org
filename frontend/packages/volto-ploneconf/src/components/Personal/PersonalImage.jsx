import { Icon } from '@plone/volto/components';
import { expandToBackendURL } from '@plone/volto/helpers';
import userSVG from '@plone/volto/icons/user.svg';

const SIZES = {
  small: '30px',
  large: '96px',
};

const PersonalImage = ({ user, size, alt }) => {
  const iconSize = SIZES[size];
  return user.portrait ? (
    <img
      src={expandToBackendURL(user.portrait)}
      alt={alt}
      className={`picture ${size}`}
    />
  ) : (
    <Icon
      name={userSVG}
      size={iconSize}
      title={alt}
      className={`default picture ${size}`}
    />
  );
};

export default PersonalImage;
