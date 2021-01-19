// Book constructor
function Book(title, author, pages, read) {
  return { title, author, pages, read };
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
document.addEventListener("click", handleChangeStatus);

function submitHandler(event) {
  if (!event.target.className.includes("button")) {
    return;
  }

  let title = document.getElementById("title").value;
  let author = document.getElementById("author").value;
  let pages = document.getElementById("pages").value;
  let read = document.getElementById("read").checked;

  console.log(read);

  // validate
  if (pages && !Number.isInteger(parseInt(pages))) {
    displayMessage("pages has to be a number", true);
    return;
  } else if (!title) {
    displayMessage("must include title", true);
    return;
  }

  // bundle form -> append to list
  let book = new Book(title, author, pages, read);
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
  let books = [];
  let _displayBooks = function () {
    console.log(books);
    libraryDisplayContainer;
  };
  myModule.addBook = function (title, author = "", pages = "", read = false) {
    let book = books.push({ title, author, pages, read });
    _displayBooks();
  };

  myModule.removeBook = function (id) {
    books.splice(id, 1);
    _displayBooks();
  };

  myModule.displayBooks = function () {
    _displayBooks();
  };
  return myModule; // returns the Object with public methods
})();

// usage
Library.displayBooks();

function handleChangeStatus(event) {
  if (event.target.className.includes("status")) {
    event.target.querySelector(".dot").classList.toggle("read");
  }
}
