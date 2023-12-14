import React from 'react';
import { Icon, UniversalLink } from '@plone/volto/components';
import cx from 'classnames';
import facebookIcon from '@plonegovbr/volto-network-block/icons/facebook.svg';
import githubIcon from '@plonegovbr/volto-network-block/icons/github.svg';
import instagramIcon from '@plonegovbr/volto-network-block/icons/instagram.svg';
import linkedinIcon from '@plonegovbr/volto-network-block/icons/linkedin.svg';
import mastodonIcon from '@plonegovbr/volto-network-block/icons/mastodon.svg';
import twitterIcon from '@plonegovbr/volto-network-block/icons/twitter.svg';
import siteIcon from '@plone/volto/icons/world.svg';

const categories = {
  remoteUrl: {
    title: 'Site',
    className: 'site',
    icon: siteIcon,
  },
  github: {
    title: 'GitHub',
    className: 'github',
    icon: githubIcon,
  },
  mastodon: {
    title: 'Mastodon',
    className: 'mastodon',
    icon: mastodonIcon,
  },
  instagram: {
    title: 'Instagram',
    className: 'instagram',
    icon: instagramIcon,
  },
  linkedin: {
    title: 'LinkedIn',
    className: 'linkedin',
    icon: linkedinIcon,
  },
  twitter: {
    title: 'X',
    className: 'twitter',
    icon: twitterIcon,
  },
  facebook: {
    title: 'Facebook',
    className: 'facebook',
    icon: facebookIcon,
  },
};

const Link = ({ id, href }) => {
  const category = categories[id];
  const linkIcon = category.icon;
  const className = category.className;
  const title = category.title;
  return (
    <UniversalLink
      href={href}
      openLinkInNewTab
      className={cx('link', 'item', `${className}`)}
      title={title}
      rel={'me'}
    >
      <Icon
        name={linkIcon}
        className={cx('link-icon', `${className}`)}
        title={title}
      />
    </UniversalLink>
  );
};

const Links = ({ links }) => {
  const items = Array.from(Object.entries(links), (item) => ({
    id: item[0],
    href: item[1],
  }));
  return (
    <div className="links">
      <div className="links wrapper">
        {links &&
          items.map((item) => (
            <Link key={item.id} id={item.id} href={item.href} />
          ))}
      </div>
    </div>
  );
};

export default Links;
