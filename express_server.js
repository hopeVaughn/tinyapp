const express = require('express');
const app = express();
const PORT = 8080; //default port

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
// set the view ingine to ejs
///////////////////////////////////////////////////////////////////////////////

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xk": "http://www.google.com"
};

///////////////////////////////////////////////////////////////////////////////
// routes render via urls
///////////////////////////////////////////////////////////////////////////////

app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  const templateVars = { shortURL: req.params.shortURL, longURL: longURL };
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
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

///////////////////////////////////////////////////////////////////////////////
// PORT listening confirmation
///////////////////////////////////////////////////////////////////////////////

app.listen(PORT, () => {
  console.log(`Example app listening on port : ${PORT}!`);
});

