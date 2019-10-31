const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const { urlDatabase, users, PORT } = require('./data');
const { generateRandomString, getUserByEmail, urlsForUser } = require('./helpers');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');

app.set("view engine", "ejs");
//1. Refactor routers into new files in a route folder.
//2. use middleware to check cookies and redirect if no cookie for specific routes.
//req.header.cookie

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['key1']
}));

app.get("/", (req, res) => {
  //need to fix the header for login/logout and users.
  let templateVars = { urls: urlDatabase, user: null };
  res.render("urls_home", templateVars);
});

app.get("/login", (req, res) => {
  let templateVars = { user: null };
  res.render("urls_login", templateVars);
});

app.post("/login", (req, res) => {
  const user = getUserByEmail(req.body.email, users); 
  if (user && bcrypt.compareSync(req.body.password, user.password) && user.email === req.body.email) {
    req.session.user_id = user.id;
    res.redirect("/urls");
  } else {
    res.statucCode = 403
    res.send("Status Code: 403");
  }
});

app.post("/logout", (req, res) => {
  req.session.user_id = null;
  res.redirect("/urls");
});

app.get("/register", (req, res) => {
  let templateVars = { user: null };
  res.render("urls_registration", templateVars);
});

app.post("/register", (req, res) => {
  if (!req.body.email || !req.body.password || getUserByEmail(req.body.email, users)) {
    res.statucCode = 403
    res.send("Status Code: 403");
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

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlsForUser(req.session.user_id, urlDatabase), user: users[req.session.user_id] };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = { longURL: req.body.longURL, userID: req.session.user_id };
  res.redirect(`/urls/${shortURL}`);
});

app.get("/urls/new", (req, res) => {
  if (!req.session.user_id) {
    res.redirect("/login");
  } else {
    let templateVars = { user: users[req.session.user_id] };
    res.render("urls_new", templateVars);
  }
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, user: users[req.session.user_id] };
  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL", (req, res) => {
  if (req.session.user_id) {
    urlDatabase[req.params.shortURL] = { longURL: req.body.longURL, userID: req.session.user_id };
    res.redirect(`/urls/${req.params.shortURL}`);
  } else {
    res.redirect("/login");
  }
})

app.post("/urls/:shortURL/delete", (req, res) => {
  if (req.session.user_id && req.session.user_id === urlDatabase[req.params.shortURL].userID) {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
  } else {
    res.send("Don't have delete priveliges for that URL");
  }
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});