const request = require('supertest');
const app = require('../../app');
const {
    connectDB,
    dropDB,
    dropCollections,
} = require('../config/databaseTest');

const agent = request.agent(app);

beforeAll(async () => {
	await connectDB();
});

// afterAll(async () => {
//     await dropCollections();
//     await dropDB();
// });

describe('GET /company-certifications', () => {
    test('returns 200 for successful get', async () => {
        const res = await agent.get('/v1/company-certifications').send();

        expect(res.statusCode).toEqual(200);
    });
});