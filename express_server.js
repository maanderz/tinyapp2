const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const PORT = 8080; // default port 8080

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

function generateRandomString() {  
  var string = "";
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for(var i = 0; i < 6; i++) {
      string += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return string;
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  let templateVars = { 
    urls: urlDatabase,
    username: req.cookies['username'] }
  res.render("urls_index", templateVars)
})

app.post("/urls", (req, res) => {
  const string = generateRandomString();
  urlDatabase[string] = req.body.longURL;
  let templateVars = { 
    shortURL: string, 
    longURL: req.body.longURL,
    username: req.cookies['username'] };
  res.render("urls_show", templateVars);
})

app.get("/urls/new", (req, res) => {
  let templateVars = { 
    username: req.cookies['username'] }
  res.render("urls_new", templateVars)
})

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies['username'] }
  res.render("urls_show", templateVars)
})

app.post("/urls/:shortURL", (req, res) => {
  const id = req.params.shortURL; 
  const newURL = req.body.longURL; 
  urlDatabase[id] = newURL; 
  let templateVars = { 
    shortURL: id, 
    longURL: newURL,
    username: req.cookies['username'] };
  res.render("urls_show", templateVars);
})

app.post("/urls/:shortURL/delete", (req, res) => {
  delete(urlDatabase[req.params.shortURL])
  res.redirect("/urls")
})

app.get("/u/:shortURL", (req, res) => {
  const longUrl = urlDatabase[req.params.shortURL];
  res.redirect(longUrl);
})

app.post("/login", (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect("/urls")
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});