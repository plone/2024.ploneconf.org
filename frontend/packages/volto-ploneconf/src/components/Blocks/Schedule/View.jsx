import React from 'react';
import { injectIntl } from 'react-intl';
import View from './DefaultView';

const ScheduleView = (props) => {
  const { data, isEditMode } = props;
  return <View data={data} isEditMode={isEditMode} />;
};

export default injectIntl(ScheduleView);
