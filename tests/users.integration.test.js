const request = require('supertest');
const { ObjectId } = require('mongodb');
const { createApp } = require('../app');
const { connectDb, disconnectDb, getDb } = require('../data/database');

const app = createApp({ enableSwagger: false });
const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);
const describeIfDb = hasDatabaseUrl ? describe : describe.skip;

function toObjectId(value) {
  if (typeof value === 'string') {
    return new ObjectId(value);
  }

  if (value && typeof value === 'object' && value.$oid) {
    return new ObjectId(value.$oid);
  }

  if (value && typeof value === 'object' && value._id) {
    return toObjectId(value._id);
  }

  return new ObjectId(String(value));
}

describeIfDb('User routes integration (MongoDB real)', () => {
  beforeAll(async () => {
    await connectDb();
  });

  afterEach(async () => {
    await getDb().collection('users').deleteMany({});
  });

  afterAll(async () => {
    await disconnectDb();
  });

  test('POST /users creates and persists a user', async () => {
    const payload = {
      name: 'Integration User',
      email: 'integration.user@example.com',
      age: 30,
      gender: 'Male',
      height: 180,
      weight: 75
    };

    const response = await request(app)
      .post('/users')
      .set('x-test-user', 'integration-tester')
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User created successfully.');

    const createdUserId = toObjectId(response.body.userId);
    const savedUser = await getDb().collection('users').findOne({ _id: createdUserId });

    expect(savedUser).toBeTruthy();
    expect(savedUser.name).toBe(payload.name);
    expect(savedUser.email).toBe(payload.email);
    expect(savedUser.age).toBe(payload.age);
    expect(savedUser.gender).toBe(payload.gender);
  });

  test('GET /users/:userId returns user from database', async () => {
    const { insertedId } = await getDb().collection('users').insertOne({
      name: 'Stored User',
      email: 'stored.user@example.com',
      age: 25,
      gender: 'Female',
      height: 165,
      weight: 60
    });

    const response = await request(app)
      .get(`/users/${insertedId.toHexString()}`)
      .set('x-test-user', 'integration-tester');

    expect(response.status).toBe(200);
    expect(response.body._id).toBe(insertedId.toHexString());
    expect(response.body.name).toBe('Stored User');
    expect(response.body.email).toBe('stored.user@example.com');
  });

  test('PUT /users/:userId updates persisted user', async () => {
    const { insertedId } = await getDb().collection('users').insertOne({
      name: 'User Before Update',
      email: 'before.update@example.com',
      age: 29,
      gender: 'Male',
      height: 175,
      weight: 72
    });

    const response = await request(app)
      .put(`/users/${insertedId.toHexString()}`)
      .set('x-test-user', 'integration-tester')
      .send({ name: 'User After Update', weight: 70 });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User updated successfully.');

    const updatedUser = await getDb().collection('users').findOne({ _id: insertedId });
    expect(updatedUser.name).toBe('User After Update');
    expect(updatedUser.weight).toBe(70);
  });

  test('DELETE /users/:userId removes persisted user', async () => {
    const { insertedId } = await getDb().collection('users').insertOne({
      name: 'User To Delete',
      email: 'user.to.delete@example.com',
      age: 33,
      gender: 'Female',
      height: 168,
      weight: 63
    });

    const response = await request(app)
      .delete(`/users/${insertedId.toHexString()}`)
      .set('x-test-user', 'integration-tester');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User deleted successfully.');

    const deletedUser = await getDb().collection('users').findOne({ _id: insertedId });
    expect(deletedUser).toBeNull();
  });
});
