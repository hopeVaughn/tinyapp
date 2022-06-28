const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const PORT = 8080;

app.use(cookieParser());
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
// helper functions
///////////////////////////////////////////////////////////////////////////////

const generateRandomString = function() {
  let randomString = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < 6; i++) {
    randomString += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomString;
};


const emailLookUp = function(email) {
  for (const id in users) {
    if (email === users[id].email) {
      return users[id];
    }
  }
  return false;
};


///////////////////////////////////////////////////////////////////////////////
// routes rendered via /urls
///////////////////////////////////////////////////////////////////////////////

app.get('/urls', (req, res) => {
  const templateVars = { user: users[req.cookies["user_id"]], urls: urlDatabase };
  res.render('urls_index', templateVars);
});


app.get("/urls/new", (req, res) => {
  if (!req.cookies["user_id"]) {
    res.redirect('/login')
  }
  const templateVars = { user: users[req.cookies["user_id"]] };
  res.render("urls_new", templateVars);
});


app.get("/urls/:shortURL", (req, res) => {

  const shortURL = req.params.shortURL
  const userID = req.cookies.user_id;
  if (!userID) {
    return res.redirect('/login')
  }

  const user = users[userID]
  if (!user) {
    return res.send('not logged in')
  }

  const url = urlDatabase[shortURL];
  const longURL = url.longURL
  const templateVars = { user, shortURL, longURL };
  res.render("urls_show", templateVars);
});

///////////////////////////////////////////////////////////////////////////////
// redirect to longURL from shortURL param
///////////////////////////////////////////////////////////////////////////////

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL
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
  const userID = req.cookies.user_id;
  const user = users[userID]

  if (user) {
    return res.send('already logged in')
  }

  const templateVars = { user: null };
  res.render("urls_register", { user: null });
});

///////////////////////////////////////////////////////////////////////////////
// login page
///////////////////////////////////////////////////////////////////////////////

app.get('/login', (req, res) => {
  const userID = req.cookies.user_id;

  if (users[userID]) {
    return res.send('already logged in')
  }
  res.render("urls_login", { user: null });
});

///////////////////////////////////////////////////////////////////////////////
// update database with new short/long URL
///////////////////////////////////////////////////////////////////////////////

app.post("/urls", (req, res) => {
  const userID = req.cookies.user_id;
  if (!userID) {
    return res.status(403).send(`you must login to create a new short url`)
  }

  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = { longURL, userID };
  console.log(urlDatabase);
  res.redirect("/urls");
});

///////////////////////////////////////////////////////////////////////////////
// /login POST endpoint
///////////////////////////////////////////////////////////////////////////////

app.post("/login", (req, res) => {
  const userLookup = emailLookUp(req.body.email);

  if (!userLookup) {
    return res.status(403).send(`No user found for ${req.body.email}, please try again`);
  }
  if (userLookup.password !== req.body.password) {
    return res.status(403).send(`<h4>Invalid Password. Please Try Again</h4>`);
  }
  res.cookie('user_id', userLookup.id);
  res.redirect("/urls");
});

///////////////////////////////////////////////////////////////////////////////
// /logout POST endpoint
///////////////////////////////////////////////////////////////////////////////

app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect("/urls");
});

///////////////////////////////////////////////////////////////////////////////
// add new user to global users object
///////////////////////////////////////////////////////////////////////////////

app.post('/register', (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send('Please enter in a valid email and passord to continue');
  }
  if (emailLookUp(req.body.email)) {
    return res.status(400).send('Email already exists. Please try again');
  }
  const userID = generateRandomString();
  users[userID] = {
    id: userID,
    email: req.body.email,
    password: req.body.password
  };
  res.cookie('user_id', userID);
  res.redirect("/urls");
});

///////////////////////////////////////////////////////////////////////////////
// delete url action
///////////////////////////////////////////////////////////////////////////////

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

///////////////////////////////////////////////////////////////////////////////
// Edit url action
///////////////////////////////////////////////////////////////////////////////

app.post("/urls/:shortURL", (req, res) => {
  const userID = req.body.user_id
  const longURL = req.body.longURL;
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = {
    longURL, userID
  }
  res.redirect("/urls");
});


///////////////////////////////////////////////////////////////////////////////
// PORT listening confirmation
///////////////////////////////////////////////////////////////////////////////

app.listen(PORT, () => {
  console.log(`tinyApp is listening on port : ${PORT}!`);
});
