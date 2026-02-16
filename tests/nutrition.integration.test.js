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

describeIfDb('Nutrition routes integration (MongoDB real)', () => {
  beforeAll(async () => {
    await connectDb();
  });

  afterEach(async () => {
    await getDb().collection('nutrition').deleteMany({});
  });

  afterAll(async () => {
    await disconnectDb();
  });

  test('POST /nutrition creates and persists an entry', async () => {
    const userId = new ObjectId();
    const payload = {
      userId: userId.toHexString(),
      mealType: 'Breakfast',
      foodItems: ['Eggs', 'Toast'],
      calories: 350,
      protein: 20,
      carbs: 30,
      fat: 10,
      date: '2026-07-01T08:00:00.000Z'
    };

    const response = await request(app)
      .post('/nutrition')
      .set('x-test-user', 'integration-tester')
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Nutrition entry created successfully.');

    const createdNutritionId = toObjectId(response.body.nutritionId);
    const savedEntry = await getDb().collection('nutrition').findOne({ _id: createdNutritionId });

    expect(savedEntry).toBeTruthy();
    expect(savedEntry.userId.toHexString()).toBe(payload.userId);
    expect(savedEntry.mealType).toBe(payload.mealType);
    expect(savedEntry.calories).toBe(payload.calories);
    expect(savedEntry.protein).toBe(payload.protein);
  });

  test('GET /nutrition/user/:userId returns entries from database', async () => {
    const userId = new ObjectId();

    await getDb().collection('nutrition').insertOne({
      userId,
      mealType: 'Lunch',
      foodItems: ['Chicken', 'Rice'],
      calories: 650,
      protein: 45,
      carbs: 70,
      fat: 18,
      date: new Date('2026-07-02T13:00:00.000Z')
    });

    const response = await request(app)
      .get(`/nutrition/user/${userId.toHexString()}`)
      .set('x-test-user', 'integration-tester');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].mealType).toBe('Lunch');
  });

  test('PUT /nutrition/:nutritionId updates persisted entry', async () => {
    const userId = new ObjectId();

    const { insertedId } = await getDb().collection('nutrition').insertOne({
      userId,
      mealType: 'Dinner',
      foodItems: ['Fish', 'Vegetables'],
      calories: 520,
      protein: 35,
      carbs: 50,
      fat: 16,
      date: new Date('2026-07-03T20:00:00.000Z')
    });

    const response = await request(app)
      .put(`/nutrition/${insertedId.toHexString()}`)
      .set('x-test-user', 'integration-tester')
      .send({ calories: 560, fat: 20 });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Nutrition entry updated successfully.');

    const updatedEntry = await getDb().collection('nutrition').findOne({ _id: insertedId });
    expect(updatedEntry.calories).toBe(560);
    expect(updatedEntry.fat).toBe(20);
  });

  test('DELETE /nutrition/:nutritionId removes persisted entry', async () => {
    const userId = new ObjectId();

    const { insertedId } = await getDb().collection('nutrition').insertOne({
      userId,
      mealType: 'Snack',
      foodItems: ['Apple', 'Nuts'],
      calories: 220,
      protein: 6,
      carbs: 25,
      fat: 12,
      date: new Date('2026-07-04T16:00:00.000Z')
    });

    const response = await request(app)
      .delete(`/nutrition/${insertedId.toHexString()}`)
      .set('x-test-user', 'integration-tester');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Nutrition entry removed successfully.');

    const deletedEntry = await getDb().collection('nutrition').findOne({ _id: insertedId });
    expect(deletedEntry).toBeNull();
  });
});
