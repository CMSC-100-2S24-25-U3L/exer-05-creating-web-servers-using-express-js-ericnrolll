import express from "express";
import { appendFileSync }  from 'fs';


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