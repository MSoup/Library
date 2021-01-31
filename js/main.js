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

const instructionsModal = document.getElementById("myModal");

// event listeners
form.addEventListener("click", handleSubmitForm);
libraryDisplayContainer.addEventListener("click", handleChangeStatus);
// menu selection
document
  .querySelector(".dropdown-content")
  .addEventListener("click", handleMenuClick, false);

// global state triggers
let editToken;

function handleSubmitForm(event) {
  if (!event.target.className.includes("button")) {
    return;
  }

  let isEditMode = document
    .querySelector(".form")
    .classList.contains("edit-mode");

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
    document.querySelector(".form").classList.toggle("edit-mode");
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
    messageBox.style.color = "white";
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
    this.displayBooks();
    return;
  };

  myModule.editBook = function (id, bookObj) {
    bookList.splice(id, 1, bookObj);
    this.displayBooks();
    return;
  };

  myModule.cloneBook = function (id) {
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

function handleChangeStatus({ target }) {
  // toggle read circle
  if (target.closest(".status")) {
    target.closest(".status").querySelector(".dot").classList.toggle("read");
    return;
  }
  // toggle remove card button
  if (target.closest("div > .remove")) {
    let findCardId = target.closest(".card").querySelector(".id").textContent;
    console.log(findCardId);

    Library.removeBook(findCardId);

    return;
  }

  // toggle edit card button
  if (target.closest("div > .edit")) {
    // toggle edit mode
    document.querySelector(".form").classList.toggle("edit-mode");
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

  if (target.closest("div > .clone")) {
    let findCardId = target.closest(".card").querySelector(".id").textContent;

    Library.cloneBook(findCardId);
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
// TODO

// save to local storage?
// TODO

function handleMenuClick(event) {
  event.preventDefault();
  let clicked = event.target.className;
  if (clicked === "usage") {
    // do stuff
    console.log(event.target.className);
    displayInstructions();
  } else if (clicked === "local-storage") {
    // do more stuff
  } else if (clicked === "firebase") {
    // do more stuff
  }
}

function displayInstructions() {
  instructionsModal.classList.toggle("display");
}

let closeButton = document.querySelector("span.close");

closeButton.onclick = function () {
  displayInstructions();
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == instructionsModal) {
    displayInstructions();
  }
};

// get text to display in instructions modal
let instructionsText = fetch("/Library/instructions.txt")
  .then((response) => response.text())
  .then(
    (textString) =>
      (document.querySelector("#instructions").textContent = textString)
  );
