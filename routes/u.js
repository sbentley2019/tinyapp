const express = require('express');
const router = express.Router();
const { urlDatabase } = require('../data');

module.exports = () => {

  router.get('/:shortURL', (req, res) => {
    if (urlDatabase[req.params.shortURL]) {
      const longURL = urlDatabase[req.params.shortURL].longURL;
      res.redirect(longURL);
    } else {
      res.statucCode = 403
      res.send("URL for the given ID does not exist.");
    }
  })

  return router;
}