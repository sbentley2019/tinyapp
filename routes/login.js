const express = require('express');
const router = express.Router();
const { getUserByEmail } = require('../helpers');
const { users } = require('../data');
const bcrypt = require('bcrypt');

module.exports = () => {
  router.get('/', (req, res) => {
      let templateVars = { user: null };
      res.render("urls_login", templateVars);
  });

  router.post('/', (req, res) => {
    const user = getUserByEmail(req.body.email, users); 
    if (user && user.email === req.body.email && bcrypt.compareSync(req.body.password, user.password)) {
      req.session.user_id = user.id;
      res.redirect("/urls");
    } else {
      res.statucCode = 403
      res.send("Email and/or password is incorrect.");
    }
  });

  return router;
};