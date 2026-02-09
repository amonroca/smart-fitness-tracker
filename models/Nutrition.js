const COLLECTION_NAME = 'nutrition';

async function insertNutrition(db, nutrition) {
  const collection = db.collection(COLLECTION_NAME);
  const result = await collection.insertOne(nutrition);
  return { _id: result.insertedId };
}

async function selectNutritionByUserId(db, userId) {
  const collection = db.collection(COLLECTION_NAME);
  const nutritionEntries = await collection.find({ userId }).toArray();
  return nutritionEntries;
}

async function updateNutritionEntry(db, nutritionId, updatedFields) {
  const collection = db.collection(COLLECTION_NAME);
  const result = await collection.updateOne(
    { _id: nutritionId },
    { $set: updatedFields }
  );
  return result;
}

async function deleteNutritionEntry(db, nutritionId) {
  const collection = db.collection(COLLECTION_NAME);
  const result = await collection.deleteOne({ _id: nutritionId });
  return result;
}

module.exports = { insertNutrition, selectNutritionByUserId, updateNutritionEntry, deleteNutritionEntry };