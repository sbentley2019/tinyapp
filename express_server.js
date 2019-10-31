const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const { PORT } = require('./data');
const cookieSession = require('cookie-session');


app.set("view engine", "ejs");
//2. use middleware to check cookies and redirect if no cookie for specific routes.
//req.header.cookie

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['key1']
}));

app.get("/", (req, res) => {
  if (req.session.user_id) {
    res.redirect('/urls');
  } else {
    res.redirect('/login')
  }
});

const loginRoutes = require('./routes/login');
app.use('/login', loginRoutes());

const logoutRoutes = require('./routes/logout');
app.use('/logout', logoutRoutes());

const registerRoutes = require('./routes/register');
app.use('/register', registerRoutes());

const urlsRoutes = require('./routes/urls');
app.use('/urls', urlsRoutes());

const uRoutes = require('./routes/u');
app.use('/u', uRoutes());

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});