const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const PORT = 8080; // default port 8080

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

function generateRandomString() {
  var string = "";
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 6; i++) {
    string += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return string;
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/urls", (req, res) => {
  const cookie = req.cookies["user_id"];
  const user = users[cookie];
  let templateVars = {
    urls: urlDatabase,
    user: user
  };
  res.render("urls_index", templateVars)
})

app.post("/urls", (req, res) => {
  const cookie = req.cookies["user_id"];
  const user = users[cookie];
  console.log(user);

  const string = generateRandomString();
  urlDatabase[string] = req.body.longURL;
  let templateVars = {
    shortURL: string,
    longURL: req.body.longURL,
    user: user
  };
  res.render("urls_show", templateVars);
})

app.get("/urls/new", (req, res) => {
  const cookie = req.cookies["user_id"];
  const user = users[cookie];
  let templateVars = {
    user: user
  };
  res.render("urls_new", templateVars)
})

app.get("/urls/:shortURL", (req, res) => {
  const cookie = req.cookies["user_id"];
  const user = users[cookie];
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: user
  };
  res.render("urls_show", templateVars)
})

app.post("/urls/:shortURL", (req, res) => {
  const cookie = req.cookies["user_id"];
  const user = users[cookie];
  const id = req.params.shortURL;
  const newURL = req.body.longURL;
  urlDatabase[id] = newURL;
  let templateVars = {
    shortURL: id,
    longURL: newURL,
    user: user
  };
  res.render("urls_show", templateVars);
})

app.post("/urls/:shortURL/delete", (req, res) => {
  delete (urlDatabase[req.params.shortURL])
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

app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect("/urls");
})

app.get("/registration", (req, res) => {
  res.render("registration")
})

app.post("/registration", (req, res) => {
  const randomId = generateRandomString();
  console.log(randomId)
  users[randomId] = {
    id: randomId,
    email: req.body.email,
    password: req.body.password
  }
  res.cookie('user_id', randomId);
  res.redirect("/urls")
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});