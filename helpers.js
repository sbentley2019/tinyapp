const generateRandomString = function() {
  const alphaNumeric = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let str = "";
  for (let i = 0; i < 6; i++) {
    str += alphaNumeric[Math.floor(Math.random() * alphaNumeric.length)];
  }
  return str;
};

const getUserByEmail = function(email, users) {
  for (let i in users) {
    if (email === users[i].email) {
      return users[i];
    }
  }
  return undefined;
};

const urlsForUser = function(id, urlDatabase) {
  let obj = {};
  for (let i in urlDatabase) {
    if (urlDatabase[i].userID === id) {
      obj[i] = urlDatabase[i].longURL;
    }
  }
  return obj;
};

module.exports = {
  generateRandomString,
  getUserByEmail,
  urlsForUser
};