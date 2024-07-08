import React from 'react';
import { withBlockExtensions } from '@plone/volto/helpers';
import { SidebarPortal } from '@plone/volto/components';

import SponsorLevelBlockData from './Data';
import SponsorLevelBlockView from './View';

const SponsorLevelBlockEdit = (props) => {
  const { data, onChangeBlock, block, selected } = props;
  return (
    <>
      <SponsorLevelBlockView {...props} isEditMode />
      <SidebarPortal selected={selected}>
        <SponsorLevelBlockData
          data={data}
          block={block}
          onChangeBlock={onChangeBlock}
        />
      </SidebarPortal>
    </>
  );
};

export default withBlockExtensions(SponsorLevelBlockEdit);
