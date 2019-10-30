const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const { urlDatabase, users, PORT } = require('./data');
const cookieParser = require('cookie-parser');

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
}


app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.get("/", (req, res) => {
  //need to make a home page
  res.send("Hello!");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.post("/login", (req, res) => {
  const user = lookupEmail(req.body.email); 
  if (user && user.password === req.body.password && user.email === req.body.email) {
    res.cookie("user_id", user.id);
    res.redirect("/urls");
  } else {
    res.statusCode = 403;
    res.send("statusCode: 403");
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

app.get("/register", (req, res) => {
  res.render("registration.ejs");
});

app.post("/register", (req, res) => {
  // registration handler
  if (!req.body.email || !req.body.password || lookupEmail(req.body.email)) {
    res.statusCode = 400;
    res.redirect("/register");
  } else {
    const id = generateRandomString();
    users[id] = {
      id: id,
      email: req.body.email,
      password: req.body.password
    }
    console.log(users);
    res.cookie("user_id", id);
    res.redirect("/urls");
  }
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase, user: users[req.cookies["user_id"]] };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

app.get("/urls/new", (req, res) => {
  let templateVars = { user: users[req.cookies["user_id"]] };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user: users[req.cookies["user_id"]] };
  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect(`/urls/${req.params.shortURL}`);
})

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});