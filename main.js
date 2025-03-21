const book = [];
const RENDER_BOOKSHELF = 'render-bookshelf';
const SAVED_BOOKSHELF = 'saved-bookshelf';
const STORAGE_KEY = 'BOOKSHELF_APPS';

document.addEventListener('DOMContentLoaded',function(){
  const bookForm = document.getElementById('bookForm');
  bookForm.addEventListener('submit', function(event){
    event.preventDefault();
    addBook();
  })
})

function addBook(){
  const bookTitle = document.getElementById('bookFormTitle').value;
  const bookAuthor = document.getElementById('bookFormAuthor').value;
  const bookYear = document.getElementById('bookFormYear').value;
  const bookIsComplete = document.getElementById('bookFormIsComplete').checked;

  const generatedID = generateId();
  const bookObject = generateBookObject(generatedID,bookTitle,bookAuthor,bookYear,bookIsComplete);
  book.push(bookObject);

  document.dispatchEvent(new Event(RENDER_BOOKSHELF));
}

function generateId(){
  return + new Date();
}

function generateBookObject(id,title,author,year,isCompleted){
  return{
    id,
    title,
    author,
    year,
    isCompleted
  }
}

document.addEventListener(RENDER_BOOKSHELF, function(){
  const uncompletedBook = document.getElementById('incompleteBookList');
  uncompletedBook.innerHTML = '';

  const completedBook = document.getElementById('completeBookList');
  completedBook.innerHTML = '';

  for(const bookItem of book){
    const bookElement = makeBook(bookItem);
    if(!bookItem.isCompleted){
      uncompletedBook.append(bookElement);
    }else{
      completedBook.append(bookElement);
    }
  }
});

function deleteBook(bookId){
  const bookTarget = findBook(bookId);
  if(bookTarget === -1)return;

  book.splice(bookTarget,1);
  document.dispatchEvent(new Event(RENDER_BOOKSHELF));
}

function editBook(bookId){
  const bookTarget = findBook(bookId);
}

function makeBook(bookObject){
  const textTitle = document.createElement('h2');
  textTitle.setAttribute('data-testid','bookItemTitle');
  textTitle.innerText = bookObject.title;

  const textAuthor = document.createElement('p');
  textAuthor.setAttribute('data-testid','bookItemAuthor');
  textAuthor.innerText = `Penulis: ${bookObject.author}`;

  const textYear = document.createElement('p');
  textYear.setAttribute('data-testid','bookItemYear');
  textYear.innerText = `Tahun: ${bookObject.year}`;

  const textContainer1 = document.createElement('div');
  textContainer1.setAttribute('data-bookid',bookObject.id);
  textContainer1.append(textTitle,textAuthor,textYear);

  const textContainer2 = document.createElement('div');
  textContainer2.append(textContainer1);
  textContainer2.setAttribute('id',`book-${bookObject}`);

  if(bookObject.isCompleted){
    
    const deleteButton = document.createElement('button');
    deleteButton.setAttribute('data-testid','bookItemDeleteButton');
    deleteButton.addEventListener('click',function(){
      deleteBook(bookObject.id);
    })
    
    const editButton = document.createElement('button');
    editButton.setAttribute('data-testid','bookItemEditButton');
    editButton.addEventListener('click',function(){
      editBook(bookObject.id);
    })
    textContainer2.append(deleteButton,editButton);
  }else{

    const isCompletedButton = document.createElement('button');
    isCompletedButton.setAttribute('data-testid','bookItemIsCompleteButton');
    isCompletedButton.addEventListener('click',function(){
      statusBook(bookObject.id);
    })
    textContainer2.append(isCompletedButton);
  }
  return textContainer2;
}

function findBook(bookId){
  for(const bookItem of book){
    if(bookItem.id === bookId){
      return bookItem;
    }
  }
  return null;
}
