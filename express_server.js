const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const { urlDatabase, users, PORT } = require('./data');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');

const generateRandomString = function() {
  const alphaNumeric = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let str = "";
  for (let i = 0; i < 6; i++) {
    str += alphaNumeric[Math.floor(Math.random() * alphaNumeric.length)];
  }
  return str;
};

const lookupEmail = function(email) {
  for (let i in users) {
    if (email === users[i].email) {
      return users[i];
    }
  }
  return false;
};

const urlsForUser = function(id) {
  let obj = {};
  for (let i in urlDatabase) {
    if (urlDatabase[i].userID === id) {
      obj[i] = urlDatabase[i].longURL;
    }
  }
  return obj;
}
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.get("/", (req, res) => {
  let templateVars = { urls: urlDatabase, user: null };
  res.render("urls_home", templateVars);
});

app.get("/login", (req, res) => {
  let templateVars = { user: null };
  res.render("urls_login", templateVars);
});

app.post("/login", (req, res) => {
  const user = lookupEmail(req.body.email); 
  if (user && bcrypt.compareSync(req.body.password, user.password) && user.email === req.body.email) {
    res.cookie("user_id", user.id);
    res.redirect("/urls");
  } else {
    res.statucCode = 403
    res.send("Status Code: 403");
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

app.get("/register", (req, res) => {
  let templateVars = { user: null };
  res.render("urls_registration", templateVars);
});

app.post("/register", (req, res) => {
  if (!req.body.email || !req.body.password || lookupEmail(req.body.email)) {
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
    res.cookie("user_id", id);
    res.redirect("/urls");
  }
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlsForUser(req.cookies["user_id"]), user: users[req.cookies["user_id"]] };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = { longURL: req.body.longURL, userID: req.cookies["user_id"] };
  res.redirect(`/urls/${shortURL}`);
});

app.get("/urls/new", (req, res) => {
  if (!req.cookies["user_id"]) {
    res.redirect("/login");
  } else {
    let templateVars = { user: users[req.cookies["user_id"]] };
    res.render("urls_new", templateVars);
  }
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, user: users[req.cookies["user_id"]] };
  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL", (req, res) => {
  if (req.cookies["user_id"]) {
    urlDatabase[req.params.shortURL] = { longURL: req.body.longURL, userID: req.cookies["user_id"] };
    res.redirect(`/urls/${req.params.shortURL}`);
  } else {
    res.redirect("/login");
  }
})

app.post("/urls/:shortURL/delete", (req, res) => {
  if (req.cookies["user_id"] && req.cookies["user_id"] === urlDatabase[req.params.shortURL].userID) {
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
  //currently doesn't work
  let longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});