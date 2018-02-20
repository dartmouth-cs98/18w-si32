
module.exports = (arrayOfIds, desiredId) => {
  const stringIds = arrayOfIds.map(id => id.toString());
  return stringIds.includes(desiredId.toString());
};
