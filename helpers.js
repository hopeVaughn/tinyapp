
const getUserByEmail = function(email, database) {
  for (const id in database) {

    if (email !== database[id].email) {
      return undefined;
    }

    if (email === database[id].email) {
      return database[id];
    }
  }

  return null;
};

const urlsForUser = function(id, database) {
  let userURLS = {};
  for (const ele in database) {

    if (id === database[ele].userID) {
      userURLS = { ...userURLS, [ele]: database[ele] };
    }
  }
  return userURLS;
};

module.exports = { getUserByEmail, urlsForUser };