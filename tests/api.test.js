const request = require('supertest');
const app = require('../server');

describe('Books API testing', () => {
    test('Should return all books', async () => {
        const response = await request(app).get('/books');

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(3);
    });

    test('Should return book by id', async () => {
        const response = await request(app).get('/books/1');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', 1);
        expect(response.body).toHaveProperty('title');
    });

    test('Should return error by book id', async () => {
        const response = await request(app).get('/books/999');

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

        const response = await request(app).post('/books').send(newBook);

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
        
        const response = await request(app).put('/books/1').send(updatedBook);

        expect(response.status).toBe(200);
        expect(response.body.genre).toBe('Fantasy/Adventure');
    });

    test('Should delete existing book', async () => {
        const response = await request(app).delete('/books/1');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message');
    });
});