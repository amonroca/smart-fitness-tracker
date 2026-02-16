const request = require('supertest');
const { createApp } = require('../app');

jest.mock('../controllers/workoutsController', () => ({
  getWorkoutsByUserId: jest.fn((req, res) => res.status(200).json([{ userId: req.params.userId }])) ,
  createWorkout: jest.fn((req, res) => res.status(201).json({ message: 'Workout created successfully.', workoutId: 'workout-id' })),
  editWorkout: jest.fn((req, res) => res.status(200).json({ message: 'Workout updated successfully.' })),
  removeWorkout: jest.fn((req, res) => res.status(200).json({ message: 'Workout deleted successfully.' }))
}));

const app = createApp({ enableSwagger: false });

const validUserId = '507f1f77bcf86cd799439011';
const validWorkoutId = '507f1f77bcf86cd799439012';

const validWorkoutPayload = {
  userId: validUserId,
  date: '2024-06-01T10:00:00Z',
  type: 'Running',
  duration: 60,
  caloriesBurned: 500,
  notes: 'Morning run'
};

describe('Workout routes', () => {
  test('GET /workouts/user/:userId rejects unauthenticated request', async () => {
    const response = await request(app)
      .get(`/workouts/user/${validUserId}`);

    expect(response.status).toBe(401);
  });

  test('GET /workouts/user/:userId returns workouts when authenticated', async () => {
    const response = await request(app)
      .get(`/workouts/user/${validUserId}`)
      .set('x-test-user', 'tester');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('POST /workouts creates workout when authenticated', async () => {
    const response = await request(app)
      .post('/workouts')
      .set('x-test-user', 'tester')
      .send(validWorkoutPayload);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Workout created successfully.');
  });

  test('POST /workouts rejects invalid payload with 400', async () => {
    const response = await request(app)
      .post('/workouts')
      .set('x-test-user', 'tester')
      .send({ userId: validUserId, type: '' });

    expect(response.status).toBe(400);
    expect(Array.isArray(response.body.errors)).toBe(true);
  });

  test('PUT /workouts/:workoutId updates workout when authenticated', async () => {
    const response = await request(app)
      .put(`/workouts/${validWorkoutId}`)
      .set('x-test-user', 'tester')
      .send({ duration: 30 });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Workout updated successfully.');
  });

  test('PUT /workouts/:workoutId rejects invalid payload with 400', async () => {
    const response = await request(app)
      .put(`/workouts/${validWorkoutId}`)
      .set('x-test-user', 'tester')
      .send({ duration: -5 });

    expect(response.status).toBe(400);
    expect(Array.isArray(response.body.errors)).toBe(true);
  });

  test('DELETE /workouts/:workoutId deletes workout when authenticated', async () => {
    const response = await request(app)
      .delete(`/workouts/${validWorkoutId}`)
      .set('x-test-user', 'tester');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Workout deleted successfully.');
  });
});
