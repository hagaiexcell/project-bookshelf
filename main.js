const BOOK_ITEMID = "itemId";

document.addEventListener("DOMContentLoaded", function () {

    const submitForm = document.querySelector(".input_section");

    submitForm.addEventListener("submit",function(event){
        event.preventDefault();
        addBook();
    });

    if(isStorageExist()){
        loadDataFromStorage();
    }
});

document.addEventListener("ondatasaved", () => {
    console.log("Data berhasil disimpan.");
 });
 document.addEventListener("ondataloaded", () => {
    refreshDataFromTodos();
 });

function makeBook(title,author,year,isCompleted){
    
    

    const h3 = document.createElement("h3");
    h3.innerText=title;


    const penulis = document.createElement("p");
    penulis.classList.add("penulis");
    penulis.innerText=author;
  

    const tahun = document.createElement("p");
    tahun.innerText=year;
   

    const article = document.createElement("article");
    article.classList.add("book_item");

    article.append(h3,penulis,tahun);
    // const green = document.createElement("button");
    // green.innerText="Selesai dibaca";
    // green.classList.add("green");

    // const red = document.createElement("button");
    // red.innerText="Hapus buku";
    // red.classList.add("red");

    if(isCompleted){
        article.append(createUndoButton());
        article.append(createRedButton());
    }else{
        article.append(createGreenButton());
        article.append(createRedButton());
    }
    
   
   
    return article;
 
}

function addBook(){
    const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
    const inputBookTitle = document.getElementById("inputBookTitle").value;
    const inputBookAuthor = document.getElementById("inputBookAuthor").value;
    const inputBookYear = document.getElementById("inputBookYear").value;
    const makeBookConst=makeBook(inputBookTitle,inputBookAuthor,inputBookYear,false);
    
    const bookObject = composeBookObject(inputBookTitle, inputBookAuthor, inputBookYear, false);
   
    makeBookConst[BOOK_ITEMID] = bookObject.id;
   books.push(bookObject);

    incompleteBookshelfList.append(makeBookConst);
    updateDataToStorage();
}

function createButton(buttonTypeClass, teks, eventListener){
    const button = document.createElement("button");
    button.classList.add(buttonTypeClass);
    button.innerText=teks;
    button.addEventListener("click",function(event){
        eventListener(event);
    });
    return button;
}

function addBookToCompleted(taskElement) {
    const newH3 = taskElement.querySelector(".book_item > h3").innerText;
    const newPenulis = taskElement.querySelector(".book_item > .penulis").innerText;
    const newTahun = taskElement.querySelector(".book_item > p").innerText;
    const newBook = makeBook(newH3,newPenulis,newTahun,true);

    const book = findBook(taskElement[BOOK_ITEMID]);
   book.isCompleted = true;
   newBook[BOOK_ITEMID] = book.id;

    const completeBookshelfList = document.getElementById("completeBookshelfList");
    completeBookshelfList.append(newBook);


    taskElement.remove();

    updateDataToStorage();
} 

function createGreenButton() {
    return createButton("green","Selesai dibaca", function(event){
         addBookToCompleted(event.target.parentElement);
    });
}

function removeBook(taskElement){

    const bookPosition = findBookIndex(taskElement[BOOK_ITEMID]);
    books.splice(bookPosition, 1);

    taskElement.remove();
    updateDataToStorage();
}

function createRedButton() {
    return createButton("red","Hapus buku", function(event){
        removeBook(event.target.parentElement);
    });
}

function UndoBookFromCompleted(taskElement){
    const newH3 = taskElement.querySelector(".book_item > h3").innerText;
    const newPenulis = taskElement.querySelector(".book_item > .penulis").innerText;
    const newTahun = taskElement.querySelector(".book_item > p").innerText;


    const newBook = makeBook(newH3,newPenulis,newTahun,false);

    const book = findBook(taskElement[BOOK_ITEMID]);
   book.isCompleted = false;
   newBook[BOOK_ITEMID] = book.id;

    const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
    incompleteBookshelfList.append(newBook);


    taskElement.remove();

    updateDataToStorage();
}

function createUndoButton() {
    return createButton("green","Belum Selesai dibaca", function(event){
        UndoBookFromCompleted(event.target.parentElement);
    });
}


function refreshDataFromTodos() {
    const listUncompleted = document.getElementById("incompleteBookshelfList");
    let listCompleted = document.getElementById("completeBookshelfList");
  
  
    for(book of books){
        const newBook = makeBook(book.title, book.author, book.year,book.isCompleted);
        newBook[BOOK_ITEMID] = book.id;
  
  
        if(book.isCompleted){
            listCompleted.append(newBook);
        } else {
            listUncompleted.append(newBook);
        }
    }
 }

