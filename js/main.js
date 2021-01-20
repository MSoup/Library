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
document.addEventListener("click", handleChangeStatus);

function submitHandler(event) {
  if (!event.target.className.includes("button")) {
    return;
  }

  let title = document.getElementById("title").value;
  let author = document.getElementById("author").value;
  let pages = document.getElementById("pages").value;
  let read = document.getElementById("read").checked ? true : false;
  let id = Library.getLength + 1;

  // validate
  if (pages && !Number.isInteger(parseInt(pages))) {
    displayMessage("Error: pages has to be a number", true);
    return;
  } else if (!title) {
    displayMessage("Error: must include title", true);
    return;
  }

  // bundle form -> append to list
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
  // make books a nodeList????
  let books = libraryDisplayContainer;

  // methods
  myModule.addBook = function (bookObj) {
    // make DOM object from bookObj
    let newCard = card.cloneNode(true);
    // modify title, author, pages, read, id
    newCard.querySelector(".title").textContent = bookObj.title;
    newCard.querySelector(".author").textContent = bookObj.author;
    newCard.querySelector(".pages").textContent = bookObj.pages;
    if (bookObj.read) {
      newCard.querySelector(".dot").classList.add("read");
    }
    books.append(newCard);
  };

  myModule.removeBook = function (id) {
    books.splice(id, 1);
  };

  myModule.getLength = () => books.length;

  myModule.displayBooks = function () {
    return console.log(books);
  };
  return myModule; // returns the Object with public methods
})();

function handleChangeStatus(event) {
  if (event.target.className.includes("status")) {
    event.target.querySelector(".dot").classList.toggle("read");
  }
}
