const libraryDisplayContainer = document.querySelector(
  ".library-display-container"
);
const messageBox = document.querySelector(".message-box");
const card = document.querySelector(".card");

const test = function () {
  const card = "hello";
  console.log("test: ", card);
};

console.log(test(), card);

// ******factory function Library
const Library = (function () {
  let myModule = {};
  // books is a nodeList, bookList is a list
  let books = libraryDisplayContainer;
  let bookList = [];

  myModule.displayMessage = function (msg, err = false) {
    if (err) {
      messageBox.textContent = "Error: " + msg;
    } else {
      messageBox.textContent = msg;
    }
  };

  myModule.saveBooks = function () {
    console.log("Saved: ", JSON.stringify(bookList));
    window.localStorage.setItem("books", JSON.stringify(bookList));
    this.displayMessage("Saved to local storage");
  };

  myModule.loadBooks = function () {
    let objList = JSON.parse(window.localStorage.getItem("books"));
    this.clear();
    objList.forEach((obj) => bookList.push(obj));
    this.displayBooks();
    this.displayMessage("Loaded from local storage");
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
  return myModule; // returns the Object with public methods
})();

export default Library;
