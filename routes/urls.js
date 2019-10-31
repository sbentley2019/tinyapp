const express = require('express');
const router = express.Router();
const { urlDatabase, users } = require('../data');
const { generateRandomString, urlsForUser } = require('../helpers');

module.exports = () => {

  router.get('/', (req, res) => {
    const templateVars = { urls: urlsForUser(req.session.user_id, urlDatabase), user: users[req.session.user_id] };
    res.render("urls_index", templateVars);
  });

  router.post('/', (req, res) => {
    if (req.session.user_id) {
      const shortURL = generateRandomString();
      urlDatabase[shortURL] = { longURL: req.body.longURL, userID: req.session.user_id };
      res.redirect(`/urls/${shortURL}`);
    } else {
      res.send('User is not logged in.');
    }
  })

  router.get('/new', (req, res) => {
    if (!req.session.user_id) {
      res.redirect("/login");
    } else {
      let templateVars = { user: users[req.session.user_id] };
      res.render("urls_new", templateVars);
    }
  })

  router.get('/:shortURL', (req, res) => {
    const url = urlDatabase[req.params.shortURL]; 

    if (!url) {
      res.send('That URL does not exist.');
    }
    if (!req.session.user_id) {
      res.send('User is not logged in.')
    }
    if (url && url.userID !== req.session.user_id) {
      res.send('User is logged in but does not own the URL.');
    }
    
    const templateVars = { shortURL: req.params.shortURL, longURL: url.longURL, user: users[req.session.user_id] };
    res.render('urls_show', templateVars); 
  })

  router.post('/:shortURL', (req, res) => {
    if (req.session.user_id) {
      urlDatabase[req.params.shortURL] = { longURL: req.body.longURL, userID: req.session.user_id };
      res.redirect(`/urls/${req.params.shortURL}`);
    } else {
      res.redirect("/login");
    }
  })

  router.post('/:shortURL/delete', (req, res) => {
    if (req.session.user_id && req.session.user_id === urlDatabase[req.params.shortURL].userID) {
      delete urlDatabase[req.params.shortURL];
      res.redirect("/urls");
    } else {
      res.send("Don't have delete priveliges for that URL");
    }
  })

  return router;
}