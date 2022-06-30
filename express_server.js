const express = require('express');

const { getUserByEmail, urlsForUser, generateRandomString } = require('./helpers');

const bodyParser = require("body-parser");

const cookieSession = require('cookie-session');

const bcrypt = require('bcryptjs');

const PORT = 8080;

const app = express();

app.use(cookieSession({
  name: 'session',
  keys: ['7', '14', '21']
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

///////////////////////////////////////////////////////////////////////////////
// hardcoded initialized databases
///////////////////////////////////////////////////////////////////////////////
const users = {};

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW"
  }
};



///////////////////////////////////////////////////////////////////////////////
// routes rendered via /urls
///////////////////////////////////////////////////////////////////////////////

app.get('/urls', (req, res) => {
  if (!req.session.user_id) {
    return res.send(`Please <a href='/login'>LOGIN</a> or <a href='/register'>REGISTER</a>`);
  }

  const userURL = urlsForUser(req.session.user_id, urlDatabase);

  const templateVars = { user: users[req.session.user_id], urls: userURL };
  res.render('urls_index', templateVars);
});


app.get("/urls/new", (req, res) => {
  if (!req.session.user_id) {
    return res.redirect('/login');
  }
  const templateVars = { user: users[req.session.user_id] };
  res.render("urls_new", templateVars);
});


app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const userID = req.session.user_id;

  if (!userID) {
    return res.redirect('/login');
  }

  const user = users[userID];

  if (!user) {
    return res.send('not logged in');
  }

  const url = urlDatabase[shortURL];
  const longURL = url.longURL;
  const templateVars = { user, shortURL, longURL };
  res.render("urls_show", templateVars);
});

///////////////////////////////////////////////////////////////////////////////
// redirect to longURL from shortURL param
///////////////////////////////////////////////////////////////////////////////

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const url = urlDatabase[shortURL];

  if (!url) {
    return res.send('The shortened url has not been generated yet please try again');
  }

  res.redirect(url.longURL);
});

///////////////////////////////////////////////////////////////////////////////
// registration page
///////////////////////////////////////////////////////////////////////////////

app.get('/register', (req, res) => {

  const userID = req.session.user_id;
  const user = users[userID];

  if (user) {
    return res.send('already logged in');
  }

  res.render("urls_register", { user: null });
});

///////////////////////////////////////////////////////////////////////////////
// login page
///////////////////////////////////////////////////////////////////////////////

app.get('/login', (req, res) => {
  const userID = req.session.user_id;

  if (users[userID]) {
    return res.send('already logged in');
  }

  res.render("urls_login", { user: null });
});

///////////////////////////////////////////////////////////////////////////////
// update database with new short/long URL
///////////////////////////////////////////////////////////////////////////////

app.post("/urls", (req, res) => {
  const userID = req.session.user_id;

  if (!userID) {
    return res.status(403).send(`you must login to create a new short url`);
  }

  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = { longURL, userID };
  res.redirect("/urls");
});

///////////////////////////////////////////////////////////////////////////////
// delete url action
///////////////////////////////////////////////////////////////////////////////

app.post("/urls/:shortURL/delete", (req, res) => {
  const userID = req.session.user_id;

  if (urlDatabase[req.params.shortURL].userID !== userID) {
    return res.send(`you cannot delete a shortURL that you did not create`);
  } else {
    delete urlDatabase[req.params.shortURL];
  }
  res.redirect("/urls");
});

///////////////////////////////////////////////////////////////////////////////
// Edit url action
///////////////////////////////////////////////////////////////////////////////

app.post("/urls/:shortURL", (req, res) => {
  const userID = req.session.user_id;

  if (!userID) {
    return res.status(403).send(`you must login to create a new short url`);
  }

  if (urlDatabase[req.params.shortURL].userID !== userID) {
    return res.send(`you cannot edit a shortURL that you did not create`);
  }

  const longURL = req.body.longURL;
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = {
    longURL, userID
  };
  res.redirect("/urls");
});

///////////////////////////////////////////////////////////////////////////////
// add new user to global users object
///////////////////////////////////////////////////////////////////////////////

app.post('/register', (req, res) => {
  const email = req.body.email;
  const textPassword = req.body.password;

  if (!email || !textPassword) {
    return res.status(400).send('Please enter in a valid email and/or password to continue');
  }

  if (getUserByEmail(email, users)) {
    return res.status(400).send('Email already exists. Please try again');
  }

  const id = generateRandomString();
  const password = bcrypt.hashSync(textPassword, 10);
  users[id] = { id, email, password };
  req.session.user_id = id;
  res.redirect("/urls");
});

///////////////////////////////////////////////////////////////////////////////
// /login POST endpoint
///////////////////////////////////////////////////////////////////////////////

app.post("/login", (req, res) => {
  const user = getUserByEmail(req.body.email, users);
  const userEmail = req.body.email;
  const password = req.body.password;

  if (!userEmail || !password) {
    return res.status(400).send('must enter email and/or password to continue');
  }

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(403).send(`<h4>Bad user name or password. Please <a href = '/register'>REGISTER</a> Or Try Again</h4>`);
  }

  req.session.user_id = user.id;
  res.redirect("/urls");
});

///////////////////////////////////////////////////////////////////////////////
// /logout POST endpoint
///////////////////////////////////////////////////////////////////////////////

app.post("/logout", (req, res) => {
  req.session = undefined;
  res.redirect("/urls");
});

///////////////////////////////////////////////////////////////////////////////
// PORT listening confirmation
///////////////////////////////////////////////////////////////////////////////

app.listen(PORT, () => {
  console.log(`tinyApp is listening on port : ${PORT}!`);
});
