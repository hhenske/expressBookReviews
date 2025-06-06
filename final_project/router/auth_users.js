const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
    return users.some((user) => user.username === username);
}

const authenticatedUser = (username,password)=>{ 
    return users.some((user) => user.username === username && user.password === password);
};

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(404).json({ message: "Error loggin in" })  
    }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({ username }, 'access', {expiresIn: 60 * 60});
    req.session.authorization = {
        accessToken, username
    }
    return res.status(200).send({ message: "User Successfully logged in" })
  } else {
    return res.status(401).json({ message: "Invalid login. Check username and password" });
  }
});

//Task 8 - Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization?.username;

  if (!username) {
    return res.status(401).json({ message: "Please log in before leaving a review" });
  }

  if (!review) {
    return res.status(400).json({ message: "Review content is missing." });
  }

  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  books[isbn].reviews[username] = review;


return res.status(200).json({message: "Review added/updated successfully.", reviews: books[isbn].reviews });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization?.username;
    
    if (!username) {
        return res.status(401).jsnon({ message: "Please log in to delete your review" });
    }

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!books[isbn].reviews || !books[isbn].reviews[username]) {
        return res.status(404).json({ message: "Review not found for this user" });
      }
      
    delete books[isbn].reviews[username];

    return res.status(200).json({ message: "Review deleted successfully", reviews: books[isbn].reviews });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
