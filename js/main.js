class Book {
  constructor(title, author, pages, read, id = 0) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.id = id;
  }
}

// query selectors
const form = document.querySelector(".form");
const messageBox = document.querySelector(".message-box");
const libraryDisplayContainer = document.querySelector(
  ".library-display-container"
);
const card = document.querySelector(".card");
const statusBox = document.querySelector(".status");

// event listeners
form.addEventListener("click", submitHandler);
libraryDisplayContainer.addEventListener("click", handleChangeStatus);

// global state triggers
let isEditMode = false;
let editToken;

function submitHandler(event) {
  if (!event.target.className.includes("button")) {
    return;
  }

  let title = document.getElementById("title").value;
  let author = document.getElementById("author").value;
  let pages = document.getElementById("pages").value;
  let read = document.getElementById("read").checked;

  // validate
  if (!author) {
    author = "author unknown";
  }
  if (!pages || parseInt(pages) == "NaN") {
    pages = "? pages";
  }
  if (!title) {
    displayMessage("Error: must include title", true);
    return;
  }

  let book = new Book(title, author, pages, read);

  // if edit mode, instead of appending to nodelist, remove book at selected index and add new book there
  if (isEditMode) {
    console.log("can edit in theory");
    isEditMode = false;
    Library.editBook(editToken, book);
    clearForm();
    return;
  }

  // bundle form -> append to nodelist
  Library.addBook(book);

  displayMessage("Added: " + book.title);
}

function displayMessage(msg, err = false) {
  if (err) {
    messageBox.style.color = "red";
  } else {
    messageBox.style.color = "black";
  }
  messageBox.textContent = msg;
}

function clearForm() {
  document.getElementById("title").value = "";
  document.getElementById("author").value = "";
  document.getElementById("pages").value = "";
}

// ******factory function Library -> lets me call addBook and removeBook as of now****
const Library = (function () {
  let myModule = {};
  // books is a nodeList, bookList is a list
  let books = libraryDisplayContainer;
  let bookList = [];

  // addBook -> accepts bookObj and pushes to list, then calls displayBooks
  myModule.addBook = function (bookObj) {
    bookList.push(bookObj);
    this.displayBooks();
    // eventually need to remove class to the card, dont forget
    return;
  };

  // removeBook -> accepts id (index of book in list), removes it from list, calls displayBooks
  myModule.removeBook = function (id) {
    bookList.splice(id, 1);
    // bookList = bookList.slice(0, id).concat(bookList.slice(id + 1));
    this.displayBooks();
    return;
  };

  myModule.editBook = function (id, bookObj) {
    bookList.splice(id, 1, bookObj);
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

function handleChangeStatus({ target }) {
  if (target.closest(".status")) {
    target.closest(".status").querySelector(".dot").classList.toggle("read");
    return;
  }
  if (target.closest("div > .remove")) {
    let findCardId = target.closest(".card").querySelector(".id").textContent;
    console.log(findCardId);

    Library.removeBook(findCardId);

    return;
  }

  if (target.closest("div > .edit")) {
    // toggle edit mode
    isEditMode = true;
    editToken = target.closest(".card").querySelector(".id").textContent;
    console.log("edit");
    document.getElementById("title").value = target
      .closest(".card")
      .querySelector(".title").textContent;
    document.getElementById("author").value = target
      .closest(".card")
      .querySelector(".author").textContent;
    document.getElementById("pages").value = target
      .closest(".card")
      .querySelector(".pages").textContent;

    document.getElementById("title").focus();
    return;
  }

  if (target.closest("div > .test")) {
    console.log("clone");
    // toss info into popup form and allow edits?
    return;
  }

  if (target.closest(".pic-container > img")) {
    console.log("edit image");
    return;
  }
}

// hide first card

libraryDisplayContainer.querySelector(".card").classList.add("hidden");

// intro message
