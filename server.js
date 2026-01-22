// Books for bookstore API
let books = [
    {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        genre: "Fiction",
        copiesAvailable: 5
    },
    {
        id: 2,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        genre: "Fiction",
        copiesAvailable: 3
    },
    {
        id: 3,
        title: "1984",
        author: "George Orwell",
        genre: "Dystopian Fiction",
        copiesAvailable: 7
    }
    // Add more books if you'd like!
];

/* Create your REST API here with the following endpoints:
    'GET /api/books': 'Get all books',
    'GET /api/books/:id': 'Get a specific book',
    'POST /api/books': 'Add a new book',
    'PUT /api/books/:id': 'Update a book',
    'DELETE /api/books/:id': 'Delete a book'
*/

const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// Only start server when running directly (not during tests)
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Books API server running at http://localhost:${port}`)
    });
}

// GET /api/books - Retrievs all books
app.get('/api/books', (req, res) => {
    res.json(books)
});

// GET /api/books/:id - Retrievs a specific book by ID
app.get('/api/books/:id', (req, res) => {
    const bookID = parseInt(req.params.id);
    const book = books.find(b => b.id === bookID)

    if (book) {
        res.json(book);
    } else {
        res.status(404).json({ error: 'Book not found' });
    }
        
});

// POST /api/books - Creates a new book
app.post('/api/books', (req, res) => {
    const { title, author, genre, copiesAvailable } = req.body;

    // Validates that input contains all required fields
    if (!title || !author || !genre || copiesAvailable === undefined) {
        return res.status(400).json({ error: 'Missing required fields: title, author, genre, copiesAvailable' });
    }

    // Validates that copiesAvailable is a number and not negative
    if (typeof copiesAvailable !== 'number' || copiesAvailable < 0) {
        return res.status(400).json({ error: 'copiesAvailable must be a non-negative number'});
    }

    const newId = books.length > 0 ? Math.max(...books.map(b => b.id)) + 1: 1;

    const newBook = {
        id: newId,
        title,
        author,
        genre,
        copiesAvailable,
    }

    books.push(newBook);
    res.status(201).json(newBook);
});

// PUT /api/books/:id - Updates an existing book by ID
app.put('/api/books/:id', (req, res) => {
    const bookID = parseInt(req.params.id);
    const { title, author, genre, copiesAvailable } = req.body;

    // Validates that input contains all required fields
    if (!title || !author || !genre || copiesAvailable === undefined) {
        return res.status(400).json({ error: 'Missing required fields: title, author, genre, copiesAvailable' });
    }

    // Validates that copiesAvailable is a number and not negative
    if (typeof copiesAvailable !== 'number' || copiesAvailable < 0) {
        return res.status(400).json({ error: 'copiesAvailable must be a non-negative number'});
    }

    const bookIndex = books.findIndex(b => b.id === bookID);

    if (bookIndex === -1) {
        return res.status(404).json({ error: 'Book not found' });
    } 
    books[bookIndex] = {
        id: bookID,
        title,
        author,
        genre,
        copiesAvailable
    };

    res.json(books[bookIndex]);
});

// DELETE /api/books/:id - Deletes a book by ID
app.delete('/api/books/:id', (req, res) => {
    const bookID = parseInt(req.params.id);

    const bookIndex = books.findIndex(b => b.id === bookID);

    if (bookIndex === -1) {
        return res.status(404).json({ error: 'Book not found' });
    }

    const deletedBook = books.splice(bookIndex, 1)[0];

    res.json({ message: 'Book deleted successfully', book: deletedBook});
    
});

// Exports app for testing
module.exports = app;