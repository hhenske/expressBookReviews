const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

//Task 6 - Register a new user
public_users.use(express.json());

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
        users.push({"username": username, "password": password});
        return res.status(200).json({ message: "You are registered. You can now login" })
    } else {
        return res.status(404).json({ message: "User already exists" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

    const doesExist = (username) => {
        let userswithsamename = users.filter((user) => {
            return user.username === username;
        });
        if (userswithsamename.length > 0){
            return true;
        } else {
            return false;
        }
    }

    const authenticatedUser = (username, password) => {
        let validusers = users.filter((user) => {
            return (user.username === username && user.password === password);
        });
        if (validusers.length > 0) {
            return true;
        } else {
            return false;
        }
    }

//Task 1 - Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

//Task 2 - Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
 });
  
//Task 3 - Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const matchingBooks = [];

  for (let key in books) {
    if (books[key].author.toLowerCase() === author.toLowerCase()) {
        matchingBooks.push({ isbn: key, ...books[key] });
    }
  }

  if (matchingBooks.length > 0) {
    res.status(200).json(matchingBooks);
  } else {
    res.status(404).json({ message: "No books found for this author" });
  }
});

// Task 4 - Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const matchingBooks = [];

  for (let key in books) {
    if (books[key].title.toLowerCase() === title.toLowerCase()) {
        matchingBooks.push({ isbn: key, ...books[key] });
    }
  }

  if (matchingBooks.length > 0) {
    res.status(200).json(matchingBooks);
  } else {
    res.status(404).json({ message: "No books found for this title" });
  }
});

//Task 5 - Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  
    if (books[isbn]) {
        const reviews = books[isbn].reviews;
    
        if (Object.keys(reviews).length === 0) {
            return res.status(200).json({ message: "There are no reviews for this book yet." });
        } else {
            return res.status(200).json(books[isbn].reviews);
        }
    } else {
        res.status(404).json({ message: "Book not found" });
    }
 });


module.exports.general = public_users;
