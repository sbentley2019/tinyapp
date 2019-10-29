const generateRandomString = function() {
  const alphaNumeric = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let str = "";
  for (let i = 0; i < 6; i++) {
    str += alphaNumeric[Math.floor(Math.random() * alphaNumeric.length)];
  }
  return str;
};

const emailLookUp = function(email, obj) {
  for (let i in obj) {
    if (email === obj[i].email) {
      return true;
    };
  }
  return false;
};

module.exports = { 
  generateRandomString,
  emailLookUp
};