import express from "express";
import { appendFileSync, readFileSync } from 'fs';


// instantiate the server
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));


// post method for adding books to the text file
app.post('/add-book', (req, res) => {

    if (validateBook(req.body.bookName, req.body.isbn, req.body.author, req.body.yearPublished)) {
        appendFileSync('books.txt', req.body.bookName + ',' + req.body.isbn + ',' + req.body.author + ',' + req.body.yearPublished + "\n");
        res.send({ succes: true });
    } else {
        res.send({ succes: false });
    }
});

// get method for searching isbn and author
app.get('/find-by-isbn-author', (req, res) => {
    var books = readFileSync("books.txt", { encoding: 'utf8', flag: 'r' }).split("\n"); // stores books into an object
    var bookExists = false; 

    for (let i=0; i<books.length; i++) {
        if (books[i].search(req.query.isbn + "," + req.query.author) != -1) {
            res.send(books[i])
            bookExists = true;
        } 
    };

    if(!bookExists) {
        res.send("Book does not exist.");
    };
})

// get method for searching author
app.get('/find-by-author', (req, res) => {
    var books = readFileSync("books.txt", { encoding: 'utf8', flag: 'r' }).split("\n"); // stores books into an object
    var authorExists = false; 
    var searchedBooks = [];
    var n = 0;

    console.log(req.query.author);

    for (let i=0; i<books.length; i++) {
        if (books[i].search(req.query.author) != -1) {
            console.log(req.query.author);
            searchedBooks[n] = books[i];
            authorExists = true;
            n++;
        } 
    };

    if (authorExists) {
        // var output = "";
        // for (let i=0; i<n; i++){
        //     output = output + searchedBooks[i] + "\n";
        // }

        // res.send(output);

        res.send(searchedBooks)

    } else {
        res.send("Author does not exist.");
    }
})

// supporting validate function
function validateBook(bookName, isbn, author, yearPublished) {
    // check if fields are existing
    if (bookName == undefined || isbn == undefined || author == undefined || yearPublished == undefined) {
        return false;
    };

    // check if fields are strings
    if (typeof(bookName) != "string" || typeof(isbn) != "string" || typeof(author) != "string" || typeof(yearPublished) != "string") {
        return false;
    };

    // check if fields are not empty strings
    if (bookName == "" || isbn == "" || author == "" || yearPublished == "") {
        return false;
    };
    
    return true;
}

app.listen(3000, () => { console.log('Server started at port 3000')} );