// Restrict to
export const sponsorLevelRestrict = ({ properties }) => {
  const contentType = properties ? properties['@type'] : {};
  return contentType === 'SponsorLevel' ? false : true;
};
