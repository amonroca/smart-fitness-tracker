const request = require('supertest');
const { createApp } = require('../app');

jest.mock('../controllers/nutritionController', () => ({
  getNutritionByUserId: jest.fn((req, res) => res.status(200).json([{ userId: req.params.userId }])) ,
  createNutritionEntry: jest.fn((req, res) => res.status(201).json({ message: 'Nutrition entry created successfully.', nutritionId: 'nutrition-id' })),
  editNutritionEntry: jest.fn((req, res) => res.status(200).json({ message: 'Nutrition entry updated successfully.' })),
  removeNutritionEntry: jest.fn((req, res) => res.status(200).json({ message: 'Nutrition entry removed successfully.' }))
}));

const app = createApp({ enableSwagger: false });

const validUserId = '507f1f77bcf86cd799439011';
const validNutritionId = '507f1f77bcf86cd799439014';

const validNutritionPayload = {
  userId: validUserId,
  mealType: 'Breakfast',
  foodItems: ['Eggs', 'Toast'],
  calories: 350,
  protein: 20,
  carbs: 30,
  fat: 10,
  date: '2024-12-31T23:59:59Z'
};

describe('Nutrition routes', () => {
  test('GET /nutrition/user/:userId rejects unauthenticated request', async () => {
    const response = await request(app)
      .get(`/nutrition/user/${validUserId}`);

    expect(response.status).toBe(401);
  });

  test('GET /nutrition/user/:userId returns nutrition entries when authenticated', async () => {
    const response = await request(app)
      .get(`/nutrition/user/${validUserId}`)
      .set('x-test-user', 'tester');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('POST /nutrition creates nutrition entry when authenticated', async () => {
    const response = await request(app)
      .post('/nutrition')
      .set('x-test-user', 'tester')
      .send(validNutritionPayload);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Nutrition entry created successfully.');
  });

  test('POST /nutrition rejects invalid payload with 400', async () => {
    const response = await request(app)
      .post('/nutrition')
      .set('x-test-user', 'tester')
      .send({ userId: validUserId, mealType: 'Invalid' });

    expect(response.status).toBe(400);
    expect(Array.isArray(response.body.errors)).toBe(true);
  });

  test('PUT /nutrition/:nutritionId updates nutrition entry when authenticated', async () => {
    const response = await request(app)
      .put(`/nutrition/${validNutritionId}`)
      .set('x-test-user', 'tester')
      .send({ calories: 400 });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Nutrition entry updated successfully.');
  });

  test('PUT /nutrition/:nutritionId rejects invalid payload with 400', async () => {
    const response = await request(app)
      .put(`/nutrition/${validNutritionId}`)
      .set('x-test-user', 'tester')
      .send({ calories: -10 });

    expect(response.status).toBe(400);
    expect(Array.isArray(response.body.errors)).toBe(true);
  });

  test('DELETE /nutrition/:nutritionId deletes nutrition entry when authenticated', async () => {
    const response = await request(app)
      .delete(`/nutrition/${validNutritionId}`)
      .set('x-test-user', 'tester');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Nutrition entry removed successfully.');
  });
});
