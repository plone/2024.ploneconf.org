export const formatHour = (value) => {
  return value.toLocaleTimeString('pt', {
    hour: '2-digit',
    minute: '2-digit',
  });
};
