const book = [];
const RENDER_BOOKSHELF = "render-bookshelf";
const SAVED_BOOKSHELF = "saved-bookshelf";
const STORAGE_KEY = "BOOKSHELF_APPS";

document.addEventListener("DOMContentLoaded", function () {
  const bookForm = document.getElementById("bookForm");
  bookForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });
});

function addBook() {
  const bookTitle = document.getElementById("bookFormTitle").value;
  const bookAuthor = document.getElementById("bookFormAuthor").value;
  const bookYear = document.getElementById("bookFormYear").value;
  const bookIsComplete = document.getElementById("bookFormIsComplete").checked;

  const generatedID = generateId();
  const bookObject = generateBookObject(
    generatedID,
    bookTitle,
    bookAuthor,
    bookYear,
    bookIsComplete
  );
  book.push(bookObject);

  document.dispatchEvent(new Event(RENDER_BOOKSHELF));
}

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

document.addEventListener(RENDER_BOOKSHELF, function () {
  const uncompletedBook = document.getElementById("incompleteBookList");
  uncompletedBook.innerHTML = "";

  const completedBook = document.getElementById("completeBookList");
  completedBook.innerHTML = "";

  for (const bookItem of book) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isCompleted) {
      uncompletedBook.append(bookElement);
    } else {
      completedBook.append(bookElement);
    }
  }
  saveData();
});

function statusBook(bookId) {
  const bookTarget = findBook(bookId);
  if (!bookTarget) return;

  bookTarget.isCompleted = !bookTarget.isCompleted;
  document.dispatchEvent(new Event(RENDER_BOOKSHELF));
}

function findBook(bookId) {
  return book.find((bookItem) => bookItem.id === bookId) || null;
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(book));
}

function deleteBook(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget === -1) return;

  book.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_BOOKSHELF));
}

function editBook(bookId) {
  const bookTarget = book.find((book) => book.id === bookId);
  if (!bookTarget) return;

  document.getElementById("bookFormTitle").value = bookTarget.title;
  document.getElementById("bookFormAuthor").value = bookTarget.author;
  document.getElementById("bookFormYear").value = bookTarget.year;
  document.getElementById("bookFormIsComplete").checked =
    bookTarget.isCompleted;

  deleteBook(bookId); // Hapus dulu data lama agar tidak duplikat saat disimpan kembali
}

function makeBook(bookObject) {
  const bookContainer = document.createElement("div");
  bookContainer.setAttribute("data-bookid", bookObject.id);
  bookContainer.setAttribute("data-testid", "bookItem");

  const textTitle = document.createElement("h3");
  textTitle.setAttribute("data-testid", "bookItemTitle");
  textTitle.innerText = bookObject.title;

  const textAuthor = document.createElement("p");
  textAuthor.setAttribute("data-testid", "bookItemAuthor");
  textAuthor.innerText = `Penulis: ${bookObject.author}`;

  const textYear = document.createElement("p");
  textYear.setAttribute("data-testid", "bookItemYear");
  textYear.innerText = `Tahun: ${bookObject.year}`;

  const textContainer1 = document.createElement("div");
  textContainer1.setAttribute("data-bookid", bookObject.id);
  textContainer1.append(textTitle, textAuthor, textYear);

  const textContainer2 = document.createElement("div");
  textContainer2.append(textContainer1);
  textContainer2.setAttribute("id", `book-${bookObject.id}`);

  const isCompletedButton = document.createElement("button");
  isCompletedButton.setAttribute("data-testid", "bookItemIsCompleteButton");
  isCompletedButton.innerText = bookObject.isCompleted
    ? "Belum dibaca"
    : "Selesai dibaca";
  isCompletedButton.addEventListener("click", function () {
    statusBook(bookObject.id);
  });

  const deleteButton = document.createElement("button");
  deleteButton.setAttribute("data-testid", "bookItemDeleteButton");
  deleteButton.innerText = "Hapus Buku";
  deleteButton.addEventListener("click", function () {
    deleteBook(bookObject.id);
  });

  const editButton = document.createElement("button");
  editButton.setAttribute("data-testid", "bookItemEditButton");
  editButton.innerText = "Edit Buku";
  editButton.addEventListener("click", function () {
    editBook(bookObject.id);
  });

  textContainer2.append(isCompletedButton, deleteButton, editButton);

  return textContainer2;
}

// Fungsi Untuk Mencari Buku
document
  .getElementById("searchBook")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const searchTitle = document
      .getElementById("searchBookTitle")
      .value.toLowerCase();
    const filteredBooks = book.filter((bookItem) =>
      bookItem.title.toLowerCase().includes(searchTitle)
    );

    renderSearchResults(filteredBooks);
  });

function renderSearchResults(filteredBooks) {
  const uncompletedBook = document.getElementById("incompleteBookList");
  const completedBook = document.getElementById("completeBookList");

  uncompletedBook.innerHTML = "";
  completedBook.innerHTML = "";

  for (const bookItem of filteredBooks) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isCompleted) {
      uncompletedBook.append(bookElement);
    } else {
      completedBook.append(bookElement);
    }
  }
}
