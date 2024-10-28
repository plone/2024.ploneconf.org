import React from 'react';
import { withBlockExtensions } from '@plone/volto/helpers';
import { SidebarPortal } from '@plone/volto/components';

import ScheduleBlockData from './Data';
import ScheduleBlockView from './View';

const ScheduleBlockEdit = (props) => {
  const { data, onChangeBlock, block, selected } = props;
  return (
    <>
      <ScheduleBlockView {...props} isEditMode />
      <SidebarPortal selected={selected}>
        <ScheduleBlockData
          data={data}
          block={block}
          onChangeBlock={onChangeBlock}
        />
      </SidebarPortal>
    </>
  );
};

export default withBlockExtensions(ScheduleBlockEdit);
