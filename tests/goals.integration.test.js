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

  return new ObjectId(String(value));
}

describeIfDb('Goal routes integration (MongoDB real)', () => {
  beforeAll(async () => {
    await connectDb();
  });

  afterEach(async () => {
    await getDb().collection('goals').deleteMany({});
  });

  afterAll(async () => {
    await disconnectDb();
  });

  test('POST /goals creates and persists a goal', async () => {
    const userId = new ObjectId();
    const payload = {
      userId: userId.toHexString(),
      goalType: 'Weight Loss',
      targetValue: 10,
      currentValue: 2,
      deadline: '2026-12-31T23:59:59.000Z',
      status: 'In Progress'
    };

    const response = await request(app)
      .post('/goals')
      .set('x-test-user', 'integration-tester')
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Goal created successfully.');

    const createdGoalId = toObjectId(response.body.goalId);
    const savedGoal = await getDb().collection('goals').findOne({ _id: createdGoalId });

    expect(savedGoal).toBeTruthy();
    expect(savedGoal.userId.toHexString()).toBe(payload.userId);
    expect(savedGoal.goalType).toBe(payload.goalType);
    expect(savedGoal.targetValue).toBe(payload.targetValue);
    expect(savedGoal.currentValue).toBe(payload.currentValue);
    expect(savedGoal.status).toBe(payload.status);
  });

  test('GET /goals/user/:userId returns goals from database', async () => {
    const userId = new ObjectId();

    await getDb().collection('goals').insertOne({
      userId,
      goalType: 'Running Distance',
      targetValue: 42,
      currentValue: 10,
      deadline: new Date('2026-11-30T23:59:59.000Z'),
      status: 'In Progress'
    });

    const response = await request(app)
      .get(`/goals/user/${userId.toHexString()}`)
      .set('x-test-user', 'integration-tester');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].goalType).toBe('Running Distance');
  });

  test('PUT /goals/:goalId updates persisted goal', async () => {
    const userId = new ObjectId();

    const { insertedId } = await getDb().collection('goals').insertOne({
      userId,
      goalType: 'Strength',
      targetValue: 100,
      currentValue: 40,
      deadline: new Date('2026-10-31T23:59:59.000Z'),
      status: 'In Progress'
    });

    const response = await request(app)
      .put(`/goals/${insertedId.toHexString()}`)
      .set('x-test-user', 'integration-tester')
      .send({ currentValue: 70, status: 'Completed' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Goal updated successfully.');

    const updatedGoal = await getDb().collection('goals').findOne({ _id: insertedId });
    expect(updatedGoal.currentValue).toBe(70);
    expect(updatedGoal.status).toBe('Completed');
  });

  test('DELETE /goals/:goalId removes persisted goal', async () => {
    const userId = new ObjectId();

    const { insertedId } = await getDb().collection('goals').insertOne({
      userId,
      goalType: 'Weight Loss',
      targetValue: 3,
      currentValue: 1,
      deadline: new Date('2026-09-30T23:59:59.000Z'),
      status: 'In Progress'
    });

    const response = await request(app)
      .delete(`/goals/${insertedId.toHexString()}`)
      .set('x-test-user', 'integration-tester');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Goal removed successfully.');

    const deletedGoal = await getDb().collection('goals').findOne({ _id: insertedId });
    expect(deletedGoal).toBeNull();
  });
});
