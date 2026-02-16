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

describeIfDb('Workout routes integration (MongoDB real)', () => {
  beforeAll(async () => {
    await connectDb();
  });

  afterEach(async () => {
    await getDb().collection('workouts').deleteMany({});
  });

  afterAll(async () => {
    await disconnectDb();
  });

  test('POST /workouts creates and persists a workout', async () => {
    const userId = new ObjectId();
    const payload = {
      userId: userId.toHexString(),
      date: '2026-06-01T10:00:00.000Z',
      type: 'Running',
      duration: 60,
      caloriesBurned: 500,
      notes: 'Morning run'
    };

    const response = await request(app)
      .post('/workouts')
      .set('x-test-user', 'integration-tester')
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Workout created successfully.');

    const createdWorkoutId = toObjectId(response.body.workoutId);
    const savedWorkout = await getDb().collection('workouts').findOne({ _id: createdWorkoutId });

    expect(savedWorkout).toBeTruthy();
    expect(savedWorkout.userId.toHexString()).toBe(payload.userId);
    expect(savedWorkout.type).toBe(payload.type);
    expect(savedWorkout.duration).toBe(payload.duration);
    expect(savedWorkout.caloriesBurned).toBe(payload.caloriesBurned);
  });

  test('GET /workouts/user/:userId returns workouts from database', async () => {
    const userId = new ObjectId();

    await getDb().collection('workouts').insertOne({
      userId,
      date: new Date('2026-06-05T10:00:00.000Z'),
      type: 'Cycling',
      duration: 40,
      caloriesBurned: 330,
      notes: 'Afternoon session'
    });

    const response = await request(app)
      .get(`/workouts/user/${userId.toHexString()}`)
      .set('x-test-user', 'integration-tester');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].type).toBe('Cycling');
  });

  test('PUT /workouts/:workoutId updates persisted workout', async () => {
    const userId = new ObjectId();

    const { insertedId } = await getDb().collection('workouts').insertOne({
      userId,
      date: new Date('2026-06-10T10:00:00.000Z'),
      type: 'Strength',
      duration: 45,
      caloriesBurned: 360,
      notes: 'Initial notes'
    });

    const response = await request(app)
      .put(`/workouts/${insertedId.toHexString()}`)
      .set('x-test-user', 'integration-tester')
      .send({ duration: 55, notes: 'Updated notes' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Workout updated successfully.');

    const updatedWorkout = await getDb().collection('workouts').findOne({ _id: insertedId });
    expect(updatedWorkout.duration).toBe(55);
    expect(updatedWorkout.notes).toBe('Updated notes');
  });

  test('DELETE /workouts/:workoutId removes persisted workout', async () => {
    const userId = new ObjectId();

    const { insertedId } = await getDb().collection('workouts').insertOne({
      userId,
      date: new Date('2026-06-15T10:00:00.000Z'),
      type: 'Running',
      duration: 30,
      caloriesBurned: 250,
      notes: 'To be deleted'
    });

    const response = await request(app)
      .delete(`/workouts/${insertedId.toHexString()}`)
      .set('x-test-user', 'integration-tester');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Workout deleted successfully.');

    const deletedWorkout = await getDb().collection('workouts').findOne({ _id: insertedId });
    expect(deletedWorkout).toBeNull();
  });
});
