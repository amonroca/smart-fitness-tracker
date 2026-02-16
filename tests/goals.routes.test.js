const request = require('supertest');
const { createApp } = require('../app');

jest.mock('../controllers/goalsController', () => ({
  getGoalsByUserId: jest.fn((req, res) => res.status(200).json([{ userId: req.params.userId }])) ,
  createGoal: jest.fn((req, res) => res.status(201).json({ message: 'Goal created successfully.', goalId: 'goal-id' })),
  editGoal: jest.fn((req, res) => res.status(200).json({ message: 'Goal updated successfully.' })),
  removeGoal: jest.fn((req, res) => res.status(200).json({ message: 'Goal removed successfully.' }))
}));

const app = createApp({ enableSwagger: false });

const validUserId = '507f1f77bcf86cd799439011';
const validGoalId = '507f1f77bcf86cd799439013';

const validGoalPayload = {
  userId: validUserId,
  goalType: 'Weight Loss',
  targetValue: 10,
  currentValue: 2,
  deadline: '2024-12-31T23:59:59Z',
  status: 'In Progress'
};

describe('Goal routes', () => {
  test('GET /goals/user/:userId rejects unauthenticated request', async () => {
    const response = await request(app)
      .get(`/goals/user/${validUserId}`);

    expect(response.status).toBe(401);
  });

  test('GET /goals/user/:userId returns goals when authenticated', async () => {
    const response = await request(app)
      .get(`/goals/user/${validUserId}`)
      .set('x-test-user', 'tester');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('POST /goals creates goal when authenticated', async () => {
    const response = await request(app)
      .post('/goals')
      .set('x-test-user', 'tester')
      .send(validGoalPayload);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Goal created successfully.');
  });

  test('POST /goals rejects invalid payload with 400', async () => {
    const response = await request(app)
      .post('/goals')
      .set('x-test-user', 'tester')
      .send({ userId: validUserId, goalType: '' });

    expect(response.status).toBe(400);
    expect(Array.isArray(response.body.errors)).toBe(true);
  });

  test('PUT /goals/:goalId updates goal when authenticated', async () => {
    const response = await request(app)
      .put(`/goals/${validGoalId}`)
      .set('x-test-user', 'tester')
      .send({ status: 'Completed' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Goal updated successfully.');
  });

  test('PUT /goals/:goalId rejects invalid payload with 400', async () => {
    const response = await request(app)
      .put(`/goals/${validGoalId}`)
      .set('x-test-user', 'tester')
      .send({ targetValue: -1 });

    expect(response.status).toBe(400);
    expect(Array.isArray(response.body.errors)).toBe(true);
  });

  test('DELETE /goals/:goalId deletes goal when authenticated', async () => {
    const response = await request(app)
      .delete(`/goals/${validGoalId}`)
      .set('x-test-user', 'tester');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Goal removed successfully.');
  });
});
