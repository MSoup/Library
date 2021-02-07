import Library from "./library.js";

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
const libraryDisplayContainer = document.querySelector(
  ".library-display-container"
);

const instructionsModal = document.getElementById("myModal");

// event listeners
form.addEventListener("click", handleSubmitForm);
libraryDisplayContainer.addEventListener("click", handleChangeStatus);
libraryDisplayContainer.querySelector(".card").classList.add("hidden");

// menu selection
document
  .querySelector(".dropdown-content")
  .addEventListener("click", handleMenuClick, false);

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
    Library.displayMessage("Must include title", true);
    return;
  }

  let book = new Book(title, author, pages, read);

  // if edit mode, instead of appending to nodelist, remove book at selected index and add new book there
  if (isEditMode) {
    let form = document.querySelector(".form");
    form.classList.toggle("edit-mode");
    Library.editBook(form.getAttribute("edit-token"), book);
    form.removeAttribute("edit-token");
    clearForm();
    return;
  }

  // bundle form -> append to nodelist
  Library.addBook(book);
}

function clearForm() {
  document.getElementById("title").value = "";
  document.getElementById("author").value = "";
  document.getElementById("pages").value = "";
}

function handleChangeStatus({ target }) {
  // toggle read circle
  let findCardId = target.closest(".card").querySelector(".id").textContent;
  if (target.closest(".status")) {
    let isReadButton = target.closest(".status").querySelector(".dot");
    isReadButton.classList.toggle("read");
    Library.toggleRead(findCardId, isReadButton.classList.contains("read"));
    return;
  }
  // toggle remove card button
  if (target.closest("div > .remove")) {
    Library.removeBook(findCardId);
    return;
  }

  // toggle edit card button
  if (target.closest("div > .edit")) {
    // toggle edit mode
    Library.displayMessage("Edit Mode");

    document.querySelector(".form").classList.toggle("edit-mode");
    document.querySelector(".form").setAttribute("edit-token", findCardId);
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
    console.log("edit image not yet implemented");
    return;
  }
}

function handleMenuClick(event) {
  event.preventDefault();
  let clicked = event.target.className;
  if (clicked === "usage") {
    // display instructions
    displayInstructions();
  } else if (clicked === "local-save") {
    Library.saveBooksLocal();
  } else if (clicked === "local-load") {
    Library.loadBooksLocal();
  } else if (clicked === "firebase-save") {
    Library.saveBooksCloud();
  } else if (clicked === "firebase-load") {
    Library.loadBooksCloud();
  }
  return;
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
