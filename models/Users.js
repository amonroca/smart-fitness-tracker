const COLLECTION_NAME = 'users';

async function insertUser(db, user) {
  const collection = db.collection(COLLECTION_NAME);
  const result = await collection.insertOne(user);
  return { _id: result.insertedId };
}

async function selectUserById(db, userId) {
  const collection = db.collection(COLLECTION_NAME);
  const user = await collection.findOne({ _id: userId });
  return user;
}

async function updateUser(db, userId, updatedFields) {
  const collection = db.collection(COLLECTION_NAME);
  const result = await collection.updateOne(
    { _id: userId },
    { $set: updatedFields }
  );
  return result;
}

async function deleteUser(db, userId) {
  const collection = db.collection(COLLECTION_NAME);
  const result = await collection.deleteOne({ _id: userId });
  return result;
}

module.exports = { insertUser, selectUserById, updateUser, deleteUser };