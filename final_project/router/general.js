const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }
  
public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "Customer successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
    let bookListPromise=new Promise((resolve,reject)=> {
        resolve(books);
    });
    bookListPromise.then((result)=> {
        res.send(JSON.stringify({books: result},null,4));
});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
    let bookDetailsByISBNPromise=new Promise((resolve,reject)=> {
        const book = books[req.params.isbn]
        resolve(book);
    });
    bookDetailsByISBNPromise.then((result)=> {
        res.send(result);
 });
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
    let bookDetailsByAuthorPromise=new Promise((resolve,reject)=> {
        let booksByAuthor = []
        let bookKeys = Object.keys(books)
        bookKeys.forEach((key) => {
          let book = books[key]
          if (book["author"] == req.params.author){
              booksByAuthor.push(Object.assign({isbn:key,title:book["title"],reviews:book["reviews"]}))
          }
        });
        resolve(booksByAuthor);
    });
    bookDetailsByAuthorPromise.then((result)=> {
        res.send(JSON.stringify({booksbyauthor: result},null,4));
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
    let bookDetailsByTitlePromise=new Promise((resolve,reject)=> {
        let booksByTitle = []
        let bookKeys = Object.keys(books)
        bookKeys.forEach((key) => {
          let book = books[key]
          if (book["title"] == req.params.title){
              booksByTitle.push(Object.assign({isbn:key,author:book["author"],reviews:book["reviews"]}))
          }
        });
        resolve(booksByTitle);
    });
    bookDetailsByTitlePromise.then((result)=> {
        res.send(JSON.stringify({booksbytitle: result},null,4));
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const book = books[req.params.isbn]
  res.send(book.reviews);
});

module.exports.general = public_users;
