const COLLECTION_NAME = 'oauth_clients';

async function insertClient(db, client) {
  const collection = db.collection(COLLECTION_NAME);
  const result = await collection.insertOne(client);
  return { _id: result.insertedId };
}

async function findClientByClientId(db, clientId) {
  const collection = db.collection(COLLECTION_NAME);
  return collection.findOne({ clientId });
}

module.exports = { insertClient, findClientByClientId };
