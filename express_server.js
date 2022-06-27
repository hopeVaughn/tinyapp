const express = require('express');
const app = express();
const PORT = 8080;

///////////////////////////////////////////////////////////////////////////////
// cookie-parser module
///////////////////////////////////////////////////////////////////////////////

const cookieParser = require('cookie-parser');
app.use(cookieParser());

///////////////////////////////////////////////////////////////////////////////
// body-parse module
///////////////////////////////////////////////////////////////////////////////

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

///////////////////////////////////////////////////////////////////////////////
// set the view ingine to ejs
///////////////////////////////////////////////////////////////////////////////

app.set('view engine', 'ejs');

///////////////////////////////////////////////////////////////////////////////
// 6 character alphanumeric generator
///////////////////////////////////////////////////////////////////////////////

const generateRandomString = function() {
  let randomString = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < 6; i++) {
    randomString += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomString;
};

///////////////////////////////////////////////////////////////////////////////
// hardcoded initialized database
///////////////////////////////////////////////////////////////////////////////

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xk": "http://www.google.com"
};

///////////////////////////////////////////////////////////////////////////////
// routes render via urls
///////////////////////////////////////////////////////////////////////////////

app.get('/urls', (req, res) => {
  const templateVars = { username: req.cookies["username"], urls: urlDatabase };
  res.render('urls_index', templateVars);
});


app.get("/urls/new", (req, res) => {
  const templateVars = { username: req.cookies["username"] };
  res.render("urls_new", templateVars);
});


app.get("/urls/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  const templateVars = { username: req.cookies["username"], shortURL: req.params.shortURL, longURL: longURL };
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
// update database with new short/long URL
///////////////////////////////////////////////////////////////////////////////

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = longURL;
  console.log(urlDatabase); // Log the POST request body to the console
  res.redirect("/urls");         // Respond with 'Ok' (we will replace this)
});

///////////////////////////////////////////////////////////////////////////////
// /login POST endpoint
///////////////////////////////////////////////////////////////////////////////

app.post("/login", (req, res) => {
  res.cookie('username', req.body.username);
  console.log(req.body);
  res.redirect("/urls");
});

///////////////////////////////////////////////////////////////////////////////
// /logout POST endpoint
///////////////////////////////////////////////////////////////////////////////

app.post("/logout", (req, res) => {
  res.clearCookie('username');
  res.redirect("/urls");
});

///////////////////////////////////////////////////////////////////////////////
// registration page
///////////////////////////////////////////////////////////////////////////////

app.get('/register', (req, res) => {
  res.render("urls_register");
});

///////////////////////////////////////////////////////////////////////////////
// delete url action
///////////////////////////////////////////////////////////////////////////////

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  console.log(req.params.shortURL);
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
  console.log(`Example app listening on port : ${PORT}!`);
});
