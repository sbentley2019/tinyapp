const express = require('express');
const router = express.Router();
const { generateRandomString, getUserByEmail } = require('../helpers');
const { users } = require('../data');
const bcrypt = require('bcrypt');

module.exports = () => {
  router.get('/', (req, res) => {
    if (req.session.user_id) {
      res.redirect("/urls");
    } else {
      let templateVars = { user: null };
      res.render("urls_registration", templateVars);
    }
  });

  router.post('/', (req, res) => {
    if (!req.body.email || !req.body.password) {
      res.statusCode = 403;
      res.send("Email and/or password was left blank.");
    } else if(getUserByEmail(req.body.email, users)) {
      res.statucCode = 403
      res.send("Email already exists.");
    } else {
      const id = generateRandomString();
      const password = req.body.password;
      const hashedPassword = bcrypt.hashSync(password, 10);
      users[id] = {
        id: id,
        email: req.body.email,
        password: hashedPassword
      }
      req.session.user_id = id;
      res.redirect("/urls");
    }
  });

  return router;
}