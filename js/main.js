const book = [];
const RENDER_BOOKSHELF = 'render-bookshelf';
const SAVED_BOOKSHELF = 'saved-bookshelf';
const STORAGE_KEY = 'BOOKSHELF_APPS';

document.addEventListener('DOMContentLoaded', function () {
  const bookForm = document.getElementById('bookForm');
  bookForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const item of data) {
      book.push(item);
    }
  }

  document.dispatchEvent(new Event(RENDER_BOOKSHELF));
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(book);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_BOOKSHELF));
  }
}

function addBook() {
  const bookTitle = document.getElementById('bookFormTitle').value;
  const bookAuthor = document.getElementById('bookFormAuthor').value;
  const bookYear = document.getElementById('bookFormYear').value;
  const bookIsComplete = document.getElementById('bookFormIsComplete').checked;

  const generatedID = generateId();
  const bookObject = generateBookObject(generatedID, bookTitle, bookAuthor, bookYear, bookIsComplete);
  book.push(bookObject);

  document.dispatchEvent(new Event(RENDER_BOOKSHELF));
  saveData();
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
    isCompleted
  };
}

document.addEventListener(RENDER_BOOKSHELF, function () {
  const uncompletedBook = document.getElementById('incompleteBookList');
  uncompletedBook.innerHTML = '';

  const completedBook = document.getElementById('completeBookList');
  completedBook.innerHTML = '';

  for (const bookItem of book) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isCompleted) {
      uncompletedBook.append(bookElement);
    } else {
      completedBook.append(bookElement);
    }
  }
});

document.addEventListener(SAVED_BOOKSHELF, function () {
  console.log('Data berhasil disimpan.');
});

function deleteBook(bookId) {
  const bookTarget = findBookIndex(bookId);
  if (bookTarget === -1) return;

  book.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_BOOKSHELF));
  saveData();
}

function editBook(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget) {
    const newTitle = prompt("Masukan judul baru: ", bookTarget.title);
    const newAuthor = prompt("Masukan Penulis buku: ", bookTarget.author);
    const newYear = prompt("Masukan tahun terbit: ", bookTarget.year);
    if (newTitle && newAuthor && newYear) {
      bookTarget.title = newTitle;
      bookTarget.author = newAuthor;
      bookTarget.year = newYear;
      document.dispatchEvent(new Event(RENDER_BOOKSHELF));
      saveData();
    }
  }
}

function statusBook(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget) {
    bookTarget.isCompleted = !bookTarget.isCompleted;
    document.dispatchEvent(new Event(RENDER_BOOKSHELF));
    saveData();
  }
}

function makeBook(bookObject) {
  const textTitle = document.createElement('h2');
  textTitle.setAttribute('data-testid', 'bookItemTitle');
  textTitle.innerText = bookObject.title;

  const textAuthor = document.createElement('p');
  textAuthor.setAttribute('data-testid', 'bookItemAuthor');
  textAuthor.innerText = `Penulis: ${bookObject.author}`;

  const textYear = document.createElement('p');
  textYear.setAttribute('data-testid', 'bookItemYear');
  textYear.innerText = `Tahun: ${bookObject.year}`;

  const textContainer1 = document.createElement('div');
  textContainer1.setAttribute('data-bookid', bookObject.id);
  textContainer1.append(textTitle, textAuthor, textYear);

  const textContainer2 = document.createElement('div');
  textContainer2.append(textContainer1);
  textContainer2.setAttribute('id', `book-${bookObject.id}`);

  const deleteButton = document.createElement('button');
  deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
  deleteButton.innerText = 'Hapus';
  deleteButton.addEventListener('click', function () {
    deleteBook(bookObject.id);
  });

  const editButton = document.createElement('button');
  editButton.setAttribute('data-testid', 'bookItemEditButton');
  editButton.innerText = 'Edit';
  editButton.addEventListener('click', function () {
    editBook(bookObject.id);
  });

  if (bookObject.isCompleted) {
    const uncompleteButton = document.createElement('button');
    uncompleteButton.setAttribute('data-testid', 'bookItemUncompleteButton');
    uncompleteButton.innerText = 'Belum Selesai Dibaca';
    uncompleteButton.addEventListener('click', function () {
      statusBook(bookObject.id);
    });
    textContainer2.append(deleteButton, editButton, uncompleteButton);
  } else {
    const completeButton = document.createElement('button');
    completeButton.setAttribute('data-testid', 'bookItemCompleteButton');
    completeButton.innerText = 'Selesai Dibaca';
    completeButton.addEventListener('click', function () {
      statusBook(bookObject.id);
    });
    textContainer2.append(deleteButton, editButton, completeButton);
  }

  return textContainer2;
}

function findBook(bookId) {
  for (const bookItem of book) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in book) {
    if (book[index].id === bookId) {
      return index;
    }
  }
  return -1;
}