// Book constructor
function Book(title, author, pages, read, id) {
  return { title, author, pages, read, id };
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

function submitHandler(event) {
  if (!event.target.className.includes("button")) {
    return;
  }

  let title = document.getElementById("title").value;
  let author = document.getElementById("author").value;
  let pages = document.getElementById("pages").value;
  let read = document.getElementById("read").checked;
  let id = Library.getLength();

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

  // bundle form -> append to nodelist
  let book = new Book(title, author, pages, read, id);
  Library.addBook(book);

  displayMessage("Added: " + book.title);
  clearForm();
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

// factory function Library -> lets me call addBook and removeBook as of now
const Library = (function () {
  let myModule = {};
  // books is a nodeList
  let books = libraryDisplayContainer;

  // methods
  myModule.addBook = function (bookObj) {
    // make DOM object from bookObj
    let newCard = card.cloneNode(true);
    newCard.classList.remove("hidden");
    // modify title, author, pages, read, id
    newCard.querySelector(".title").textContent = bookObj.title;
    newCard.querySelector(".author").textContent = bookObj.author;
    newCard.querySelector(".pages").textContent = bookObj.pages;
    if (bookObj.read) {
      newCard.querySelector(".dot").classList.add("read");
    }
    newCard.querySelector(".id").textContent = bookObj.id;
    books.append(newCard);
  };

  myModule.removeBook = function (id) {
    console.log(books.querySelector(".id"));
  };

  myModule.getLength = function () {
    return books.querySelectorAll(".id").length;
  };

  myModule.displayBooks = function () {
    return console.log(books);
  };
  return myModule; // returns the Object with public methods
})();

function handleChangeStatus(e) {
  if (e.target.closest(".status")) {
    e.target.closest(".status").querySelector(".dot").classList.toggle("read");
    return;
  }
  if (e.target.closest("div > .test2")) {
    console.log("deleted");
    return;
  }

  if (e.target.closest("div > .test1")) {
    console.log("edit");
    // toss info into popup form and allow edits?
    return;
  }

  if (e.target.closest("div > .test")) {
    console.log("clone");
    // toss info into popup form and allow edits?
    return;
  }

  if (e.target.closest(".pic-container> img")) {
    console.log("edit image");
    return;
  }
}

// hide first card

libraryDisplayContainer.querySelector(".card").classList.add("hidden");

// intro message
