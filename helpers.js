
const getUserByEmail = function(email, database) {

  for (const id in database) {
    if (email === database[id].email) {
      return database[id];
    }
  }

  return undefined;
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

const generateRandomString = function() {
  let randomString = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < 6; i++) {
    randomString += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomString;
};


module.exports = { getUserByEmail, urlsForUser, generateRandomString };