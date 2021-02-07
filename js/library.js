const firebaseConfig = {
  apiKey: "AIzaSyCHnPHqYB7-VS5eRb8fdq2rg58nIqn4Q-Q",
  authDomain: "library-app-302200.firebaseapp.com",
  projectId: "library-app-302200",
  storageBucket: "library-app-302200.appspot.com",
  messagingSenderId: "886149518701",
  appId: "1:886149518701:web:df316f355b7a7bd0b93664",
  measurementId: "G-ZED6N1KLFK",
};

firebase.initializeApp(firebaseConfig);

const libraryDisplayContainer = document.querySelector(
  ".library-display-container"
);
const messageBox = document.querySelector(".message-box");
const card = document.querySelector(".card");

// factory function Library
const Library = (function () {
  let myModule = {};
  // books -> nodeList, bookList -> list
  let books = libraryDisplayContainer;
  let bookList = [];

  myModule.displayMessage = function (msg, err = false) {
    if (err) {
      messageBox.textContent = "Error: " + msg;
    } else {
      messageBox.textContent = msg;
    }
  };

  myModule.saveBooksLocal = function () {
    window.localStorage.setItem("books", JSON.stringify(bookList));
    this.displayMessage("Saved to local storage");
  };

  myModule.loadBooksLocal = function () {
    let objList = JSON.parse(window.localStorage.getItem("books"));
    this.clear();
    objList.forEach((obj) => bookList.push(obj));
    this.displayBooks();
    this.displayMessage("Loaded from local storage");
    document.getElementById("title").focus();
  };

  myModule.saveBooksCloud = function () {
    let books = firebase.database().ref("books");
    books.set(bookList);
    this.displayMessage("Saved to cloud storage");
  };

  myModule.loadBooksCloud = function () {
    firebase
      .database()
      .ref("books")
      .once("value")
      .then((result) => {
        this.clear();
        result.val().forEach((book) => bookList.push(book));
        this.displayBooks();
        document.getElementById("title").focus();
      });

    this.displayMessage("Loaded from cloud storage");
  };

  myModule.clear = () => {
    bookList = [];
  };

  // addBook -> accepts bookObj and pushes to list, then calls displayBooks
  myModule.addBook = function (bookObj) {
    bookList.push(bookObj);
    this.displayBooks();
    // eventually need to remove class to the card, dont forget
    this.displayMessage("Added: " + JSON.stringify(bookObj.title));
    return;
  };

  // removeBook -> accepts id (index of book in list), removes it from list, calls displayBooks
  myModule.removeBook = function (id) {
    this.displayMessage("Removed: " + JSON.stringify(bookList[id].title));
    bookList.splice(id, 1);
    this.displayBooks();
    return;
  };

  myModule.toggleRead = function (id, isRead) {
    if (isRead) {
      bookList[id].read = true;
    } else {
      bookList[id].read = false;
    }
  };
  myModule.editBook = function (id, bookObj) {
    this.displayMessage("Edited: " + JSON.stringify(bookList[id].title));

    bookList.splice(id, 1, bookObj);
    this.displayBooks();
    return;
  };

  myModule.cloneBook = function (id) {
    this.displayMessage("Cloned: " + JSON.stringify(bookList[id].title));

    bookList.splice(id, 0, bookList[id]);
    this.displayBooks();
    return;
  };
  // render books into DOM
  myModule.displayBooks = function () {
    // remove childnodes except the hidden template card
    while (books.children.length > 1) {
      books.removeChild(books.children[1]);
    }

    // iterate through book objects and create cards
    for (let i = 0; i < bookList.length; i++) {
      let bookObj = bookList[i];

      let newCard = card.cloneNode(true);
      // modify title, author, pages, read
      newCard.querySelector(".title").textContent = bookObj.title;
      newCard.querySelector(".author").textContent = bookObj.author;
      newCard.querySelector(".pages").textContent = bookObj.pages;
      if (bookObj.read) {
        newCard.querySelector(".dot").classList.add("read");
      }
      newCard.querySelector(".id").textContent = i;

      books.append(newCard);
      newCard.classList.remove("hidden");
    }

    return;
  };
  return myModule;
})();

export default Library;
