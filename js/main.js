// Main app

const form = document.querySelector(".form");
let library = [];

const submitButton = document.querySelector(".submit");
const messageBox = document.querySelector(".message-box");
const displayBooks = document.querySelector(".window-container");

submitButton.addEventListener("click", submitHandler);

// creates object with submitted values and sends to global book list
function submitHandler() {
  let title = document.getElementById("title").value;
  let author = document.getElementById("author").value;
  let pages = document.getElementById("pages").value;
  let read = document.getElementById("read").checked;

  // validate
  if (pages && !Number.isInteger(parseInt(pages))) {
    displayMessage("pages has to be a number", true);
    return;
  } else if (!title) {
    displayMessage("must include title", true);
    return;
  }
  let book = {
    title: title,
    author: author,
    pages: parseInt(pages),
    read: read,
  };
  // debugging
  displayMessage("Added: " + book.title);
  library.push(book);
  displayLibrary();
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

function displayLibrary() {
  library.forEach((book) => {
    console.table(book);
    displayBooks.append(book);
  });
}

function clearForm() {
  let title = document.getElementById("title");
  let author = document.getElementById("author");
  let pages = document.getElementById("pages");

  title.value = "";
  author.value = "";
  pages.value = "";
}
