const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const { generateRandomString, emailLookUp } = require('./functionFile');
const { urlDatabase, users, PORT } = require('./data');
const cookieParser = require('cookie-parser');

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.get("/", (req, res) => {
  //need to make a home page
  res.send("Hello!");
});

app.post("/login", (req, res) => {
  // need to change username to user_id
  console.log(req.body.username);
  res.cookie("username", req.body.username);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
    // need to change username to user_id
  res.clearCookie("username");
  res.redirect("/urls");
});

app.get("/register", (req, res) => {
  res.render("registration.ejs");
});

app.post("/register", (req, res) => {
  // registration handler
  if (!req.body.email || !req.body.password || emailLookUp(req.body.email, users)) {
    res.statusCode = 400;
    res.send("Status Code: 400");
  } else {
    let id = generateRandomString();
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
    // need to change username to user_id
  let templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

app.get("/urls/new", (req, res) => {
    // need to change username to user_id
  let templateVars = { username: req.cookies["username"] };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
    // need to change username to user_id
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies["username"] };
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