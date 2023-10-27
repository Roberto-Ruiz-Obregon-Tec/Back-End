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

afterAll(async () => {
    await dropCollections();
    await dropDB();
});

const testEventNameSearch = (nameTest) => async () => {
	const res = await agent
		.get('/v1/event?eventName[regex]=${nameTest}&limit=8')
		.send();

	expect(res.statusCode).toEqual(200);

	res.body.data.documents.forEach((course) => {
		expect(true).toEqual(course.eventName.includes(nameTest));
	});
};

describe('Event gets APIFeatures', () => {
	describe('GET /event?eventName[regex]=', () => {
		test('successful', testEventNameSearch('Evento'));
	});
});

describe('GET /event/:id', () => {
    test('returns 404 for non-existent event', async () => {
      const res = await agent.get('/v1/event/123456789012').send();

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual('No document found with that ID');
    });
  });