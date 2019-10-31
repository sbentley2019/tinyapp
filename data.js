const bcrypt = require('bcrypt');

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};


const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur", 10)
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk", 10)
  },
  "user3": {
    id: "user3",
    email: "asdf@email.com",
    password: bcrypt.hashSync("asdf", 10)
  }
};

const PORT = 8080;

module.exports = {
  PORT,
  urlDatabase,
  users
};