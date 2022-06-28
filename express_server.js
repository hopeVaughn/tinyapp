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

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xk": "http://www.google.com"
};

const users = {};

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
      return true;
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
  const templateVars = { user: users[req.cookies["user_id"]] };
  res.render("urls_new", templateVars);
});


app.get("/urls/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  const templateVars = { user: users[req.cookies["user_id"]], shortURL: req.params.shortURL, longURL: longURL };
  res.render("urls_show", templateVars);
});

///////////////////////////////////////////////////////////////////////////////
// redirect to longURL from shortURL param
///////////////////////////////////////////////////////////////////////////////

app.get("/u/:shortURL", (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    res.send('The shortened url has not been generated yet please try again');
  }
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

///////////////////////////////////////////////////////////////////////////////
// registration page
///////////////////////////////////////////////////////////////////////////////

app.get('/register', (req, res) => {
  const templateVars = { user: users[req.cookies["user_id"]] };
  res.render("urls_register", templateVars);
});

///////////////////////////////////////////////////////////////////////////////
// login page
///////////////////////////////////////////////////////////////////////////////

app.get('/login', (req, res) => {
  const templateVars = { user: users[req.cookies["user_id"]] };
  res.render("urls_login", templateVars);
});

///////////////////////////////////////////////////////////////////////////////
// update database with new short/long URL
///////////////////////////////////////////////////////////////////////////////

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = longURL;
  console.log(urlDatabase);
  res.redirect("/urls");
});

///////////////////////////////////////////////////////////////////////////////
// /login POST endpoint
///////////////////////////////////////////////////////////////////////////////

app.post("/login", (req, res) => {
  if (!emailLookUp(req.body.email)) {
    return res.status(403).json({ msg: `No user found for ${req.body.email}, please try again` });
  }
  if (emailLookUp(req.body.email)) {
    for (const id in users) {
      if (req.body.password !== users[id].password) {
        return res.status(403).send(`<h4>Invalid Password. Please Try Again</h4>`);
      } else {
        res.cookie('user_id', users[id].id);
      }
    }
  }
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
    return res.status(400).json({ msg: 'Please enter in a valid email and passord to continue' });
  }
  if (emailLookUp(req.body.email)) {
    return res.status(400).json({ msg: 'Email already exists. Please try again' });
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
  const longURL = req.body.longURL;
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = longURL;
  res.redirect("/urls");
});


///////////////////////////////////////////////////////////////////////////////
// PORT listening confirmation
///////////////////////////////////////////////////////////////////////////////

app.listen(PORT, () => {
  console.log(`tinyApp is listening on port : ${PORT}!`);
});
