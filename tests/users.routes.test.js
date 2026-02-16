const request = require('supertest');
const { createApp } = require('../app');

jest.mock('../controllers/usersController', () => ({
  getUserById: jest.fn((req, res) => res.status(200).json({ _id: req.params.userId })),
  createUser: jest.fn((req, res) => res.status(201).json({ message: 'User created successfully.', userId: 'user-id' })),
  editUser: jest.fn((req, res) => res.status(200).json({ message: 'User updated successfully.' })),
  removeUser: jest.fn((req, res) => res.status(200).json({ message: 'User deleted successfully.' }))
}));

const app = createApp({ enableSwagger: false });

const validUserId = '507f1f77bcf86cd799439011';

const validUserPayload = {
  name: 'User Test',
  email: 'user@example.com',
  age: 30,
  gender: 'Male',
  height: 180,
  weight: 75
};

describe('User routes', () => {
  test('GET /users/:userId rejects unauthenticated request', async () => {
    const response = await request(app)
      .get(`/users/${validUserId}`);

    expect(response.status).toBe(401);
  });

  test('GET /users/:userId returns user when authenticated', async () => {
    const response = await request(app)
      .get(`/users/${validUserId}`)
      .set('x-test-user', 'tester');

    expect(response.status).toBe(200);
    expect(response.body._id).toBe(validUserId);
  });

  test('POST /users creates user when authenticated', async () => {
    const response = await request(app)
      .post('/users')
      .set('x-test-user', 'tester')
      .send(validUserPayload);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User created successfully.');
  });

  test('POST /users rejects invalid payload with 400', async () => {
    const response = await request(app)
      .post('/users')
      .set('x-test-user', 'tester')
      .send({ email: 'not-an-email' });

    expect(response.status).toBe(400);
    expect(Array.isArray(response.body.errors)).toBe(true);
  });

  test('PUT /users/:userId updates user when authenticated', async () => {
    const response = await request(app)
      .put(`/users/${validUserId}`)
      .set('x-test-user', 'tester')
      .send({ name: 'Updated' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User updated successfully.');
  });

  test('PUT /users/:userId rejects invalid payload with 400', async () => {
    const response = await request(app)
      .put(`/users/${validUserId}`)
      .set('x-test-user', 'tester')
      .send({ email: 'bad-email' });

    expect(response.status).toBe(400);
    expect(Array.isArray(response.body.errors)).toBe(true);
  });

  test('DELETE /users/:userId deletes user when authenticated', async () => {
    const response = await request(app)
      .delete(`/users/${validUserId}`)
      .set('x-test-user', 'tester');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User deleted successfully.');
  });
});
