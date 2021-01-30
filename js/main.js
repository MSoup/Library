class Book {
  constructor(title, author, pages, read, id) {
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
  // clearForm();
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
  // methods
  myModule.addBook = function (bookObj) {
    bookList.push(bookObj);
    this.displayBooks();
    // eventually need to remove class to the card, dont forget
  };

  myModule.removeBook = function (id) {
    bookList = bookList.slice(0, id).concat(bookList.slice(id + 1));

    // let searchList = books.querySelectorAll(".card");
    // for (let i = 0; i < searchList.length; i++) {
    //   let book = searchList[i].querySelector(".id");
    //   if (book.textContent === id) {
    //     console.log(book.textContent + " found");
    //     console.log(searchList);
    //     let card = book.closest(".card");
    //     card.parentNode.removeChild(card);
    //   }
    // }
    this.displayBooks();
    return;
  };

  myModule.getLength = function () {
    return books.querySelectorAll(".id").length;
  };

  myModule.displayBooks = function () {
    while (books.children.length > 1) {
      books.removeChild(books.children[1]);
    }

    // iterate through book objects and create cards

    for (let i = 0; i < bookList.length; i++) {
      let bookObj = bookList[i];

      let newCard = card.cloneNode(true);
      // modify title, author, pages, read, id
      newCard.querySelector(".title").textContent = bookObj.title;
      newCard.querySelector(".author").textContent = bookObj.author;
      newCard.querySelector(".pages").textContent = bookObj.pages;
      if (bookObj.read) {
        newCard.querySelector(".dot").classList.add("read");
      }
      newCard.querySelector(".id").textContent = i + 1;

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
    console.log("deleted");
    let findCardId = target.closest(".card").querySelector(".id").textContent;
    Library.removeBook(findCardId);

    return;
  }

  if (target.closest("div > .edit")) {
    console.log("edit");
    // toss info into popup form and allow edits?
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
