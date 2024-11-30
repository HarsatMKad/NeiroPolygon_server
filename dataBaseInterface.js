const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";

const mongoClient = new MongoClient(url);
const db = mongoClient.db("NeiroPolygon");
const collection = db.collection("Users");

async function addUser(mail, pasword) {
  try {
    await mongoClient.connect();
    const user = { mail: mail, pasword: pasword };
    const result = await collection.insertOne(user);
    console.log(result);
  } catch (err) {
    console.log(err);
  } finally {
    await mongoClient.close;
  }
}

async function getAllUsers() {
  try {
    await mongoClient.connect();
    const result = await collection.find().toArray();
    console.log(result);
  } catch (err) {
    console.log(err);
  } finally {
    await mongoClient.close;
  }
}

getAllUsers();
