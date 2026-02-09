const COLLECTION_NAME = 'workouts';

async function insertWorkout(db, workout) {
  const collection = db.collection(COLLECTION_NAME);
  const result = await collection.insertOne(workout);
  return { _id: result.insertedId };
}

async function selectWorkoutsByUserId(db, userId) {
  const collection = db.collection(COLLECTION_NAME);
  const workouts = await collection.find({ userId }).toArray();
  return workouts;
}

async function updateWorkout(db, workoutId, updatedFields) {
  const collection = db.collection(COLLECTION_NAME);
  const result = await collection.updateOne(
    { _id: workoutId },
    { $set: updatedFields }
  );
  return result;
}

async function deleteWorkout(db, workoutId) {
  const collection = db.collection(COLLECTION_NAME);
  const result = await collection.deleteOne({ _id: workoutId });
  return result;
}

module.exports = { insertWorkout, selectWorkoutsByUserId, updateWorkout, deleteWorkout };