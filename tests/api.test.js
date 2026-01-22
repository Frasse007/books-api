const request = require('supertest');
const app = require('../server');

describe('Books API testing', () => {
    beforeEach(() => {
        const originalBooks = [
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
        ];
    });
    
    test('Should return all books', async () => {
        const response = await request(app).get('/api/books');

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(3);
    });

    test('Should return book by id', async () => {
        const response = await request(app).get('/api/books/1');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', 1);
        expect(response.body).toHaveProperty('title');
    });

    test('Should return error by book id', async () => {
        const response = await request(app).get('/api/books/999');

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error');
    });

    test('Should create a new book', async () => {
        const newBook = {
            title: "The Alchemist",
            author: "Paulo Coelho",
            genre: "Fantasy/Adventure",
            copiesAvailable: 9
        };

        const response = await request(app).post('/api/books').send(newBook);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe('The Alchemist');
    });

    test('Should update existing book', async () => {
        const updatedBook = {
            title: "The Alchemist",
            author: "Paulo Coelho",
            genre: "Fantasy/Adventure",
            copiesAvailable: 9
        };
        
        const response = await request(app).put('/api/books/1').send(updatedBook);

        expect(response.status).toBe(200);
        expect(response.body.genre).toBe('Fantasy/Adventure');
    });

    test('Should delete existing book', async () => {
        const response = await request(app).delete('/api/books/1');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message');
    });

    test('Should return 400 for POST with missing fields', async () => {
        const incompleteBook = {
            title: "Incomplete Book"
        };

        const response = await request(app).post('/api/books').send(incompleteBook);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });

    test('Should return 400 for POST with invalid copiesAvailable', async () => {
        const invalidBook = {
            title: "The Alchemist",
            author: "Paulo Coelho",
            genre: "Fantasy/Adventure",
            copiesAvailable: -5
        };

        const response = await request(app).post('/api/books').send(invalidBook);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });

    test('Should return 404 for PUT with non-existent ID', async () => {
        const updatedBook = {
            title: "The Alchemist",
            author: "Paulo Coelho",
            genre: "Fantasy/Adventure",
            copiesAvailable: 5
        };

        const response = await request(app).put('/api/books/9999').setEncoding(updatedBook);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error');
    });

    test('Should return 400 for PUT with missing fields', async () => {
        const incompleteUpdate = {
            title: "Incomplete Book"
        };

        const response = await request(app).put('/api/books/1').send(incompleteUpdate);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });
});