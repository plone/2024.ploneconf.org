import React from 'react';
import { BlockDataForm } from '@plone/volto/components';
import { sponsorLevelSchema } from './schema';
import { useIntl } from 'react-intl';

const titleBlockData = (props) => {
  const { data, block, onChangeBlock, blocksConfig, navRoot, contentType } =
    props;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const intl = useIntl();
  const schema = sponsorLevelSchema({ ...props, intl });
  const onChangeField = (id, value) => {
    onChangeBlock(block, {
      ...data,
      [id]: value,
    });
  };

  return (
    <BlockDataForm
      schema={schema}
      title={schema.title}
      onChangeField={onChangeField}
      onChangeBlock={onChangeBlock}
      formData={data}
      block={block}
      blocksConfig={blocksConfig}
      navRoot={navRoot}
      contentType={contentType}
    />
  );
};

export default titleBlockData;
