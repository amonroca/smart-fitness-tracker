const COLLECTION_NAME = 'goals';

async function insertGoal(db, goal) {
  const collection = db.collection(COLLECTION_NAME);
  const result = await collection.insertOne(goal);
  return { _id: result.insertedId };
}

async function selectGoalsByUserId(db, userId) {
  const collection = db.collection(COLLECTION_NAME);
  const goals = await collection.find({ userId }).toArray();
  return goals;
}

async function updateGoal(db, goalId, updatedFields) {
  const collection = db.collection(COLLECTION_NAME);
  const result = await collection.updateOne(
    { _id: goalId },
    { $set: updatedFields }
  );
  return result.modifiedCount;
}

async function deleteGoal(db, goalId) {
  const collection = db.collection(COLLECTION_NAME);
  const result = await collection.deleteOne({ _id: goalId });
  return result;
}

module.exports = { insertGoal, selectGoalsByUserId, updateGoal, deleteGoal };