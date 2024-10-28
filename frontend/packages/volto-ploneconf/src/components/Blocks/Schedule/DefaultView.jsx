import React from 'react';
import Schedule from '../../Schedule/Schedule';

const ScheduleView = (props) => {
  const { data, isEditMode } = props;
  const { filter, displayDayIndex } = data;
  return (
    <Schedule
      displayDayIndex={displayDayIndex}
      filterByDay={filter}
      isEditMode={isEditMode}
    />
  );
};

export default ScheduleView;
