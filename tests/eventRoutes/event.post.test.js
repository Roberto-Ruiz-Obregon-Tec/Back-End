const request = require('supertest');
const app = require('../../app');
const {
    connectDB,
    dropDB,
    dropCollections,
} = require('../config/databaseTest');
const { createUser, createAdmin } = require('../config/dataBaseTestSetUp');
const { loginAdmin, loginUser } = require('../config/authSetUp');

const agent = request.agent(app);

beforeAll(async () => {
    await connectDB();
    await createAdmin();
    // Will set header to allow access to protected and restricted routes
    await loginAdmin(agent, 'dummy_admin@gmail.com', 'contra123');
});

afterAll(async () => {
    await dropCollections();
    await dropDB();
});

describe('Event post', () => {
    describe('Successful POST /v1/event', () => {
        test('successful', async () => {
            const res = await agent.post('/v1/event').send({
                eventName: 'Pruebas de backend',
                description: 'esto es una prueba de testing',
				location: '76060',
                startDate: '2023-06-23',
                endDate: '2023-07-30',
				imageUrl:
                    'https://www.bbva.com/wp-content/uploads/2017/08/bbva-balon-futbol-2017-08-11.jpg',
            });
            expect(res.statusCode).toEqual(201);
            expect(res.body).toBeTruthy();
        });
    });

    describe('Error POST /v1/event due to missing event name', () => {
        test('Returns 400', async () => {
            const res = await agent.post('/v1/event').send({
                postalCode: '76000',
                imageUrl:
                    'https://www.google.com/search?q=futbol&source=lnms&tbm=isch&sa=X&ved=2ahUKEwjAzN3B-bb-AhVLlWoFHQ2aDS8Q_AUoAXoECAIQAw&biw=1536&bih=810&dpr=1.25',
            });
            expect(res.statusCode).toEqual(400);
            expect(res.body).toBeTruthy();
        });
    });

	describe('Error POST /v1/event due to invalid startDate', () => {
		test('returns 400', async () => {
		  const res = await agent.post('/v1/event').send({
			eventName: 'Pruebas de backend',
			description: 'esto es una prueba de testing',
			location: '76060',
			startDate: '2023-06-311',
			endDate: '2023-07-30',
			imageUrl:
                    'https://www.bbva.com/wp-content/uploads/2017/08/bbva-balon-futbol-2017-08-11.jpg',
		  });
		  expect(res.statusCode).toEqual(400);
		  expect(res.body.message).toEqual('Datos inválidos: Cast to date failed for value "2023-06-311" (type string) at path "startDate"');
		});
	});

	describe('Error POST /v1/event due to invalid endDate', () => {
		test('returns 400', async () => {
			const res = await agent.post('/v1/event').send({
			eventName: 'Pruebas de backend',
			description: 'esto es una prueba de testing',
			location: '76060',
			startDate: '2023-06-23',
			endDate: '2023-07-32',
			imageUrl:
                    'https://www.bbva.com/wp-content/uploads/2017/08/bbva-balon-futbol-2017-08-11.jpg',
			});
			expect(res.statusCode).toEqual(400);
			expect(res.body.message).toEqual('Datos inválidos: Cast to date failed for value "2023-07-32" (type string) at path "endDate"');
		});
	});
	  

	describe('Error POST /v1/event due to invalid imageUrl', () => {
		test('returns 400', async () => {
			const res = await agent.post('/v1/event').send({
			eventName: 'Pruebas de backend',
			description: 'esto es una prueba de testing',
			location: '76060',
			startDate: '2023-06-23',
			endDate: '2023-07-30',
			imageUrl: 'invalid',
			});
			expect(res.statusCode).toEqual(400);
			expect(res.body.message).toEqual('Datos inválidos: Validator failed for path `imageUrl` with value `invalid`');
		});
	});
});