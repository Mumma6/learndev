import { MongoClient } from "mongodb"

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
const options = {}

let indexesCreated = false
async function createIndexes (client: MongoClient) {
  if (indexesCreated) return client
  const db = client.db("dev")
  await Promise.all([

    db.collection("users").createIndexes([{ key: { email: 1 }, unique: true }])
  ])
  indexesCreated = true
  return client
}

export async function getMongoClient () {
  /**
   * Global is used here to maintain a cached connection across hot reloads
   * in development. This prevents connections growing exponentiatlly
   * during API Route usage.
   * https://github.com/vercel/next.js/pull/17666
   */
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri)
    console.log("Connected to MongoDB")
    global._mongoClientPromise = client.connect().then(async (client) => await createIndexes(client))
  }
  console.log("Return MongoPromise")
  return await global._mongoClientPromise
}

export async function getMongoDb () {
  const mongoClient = await getMongoClient()
  return mongoClient.db("dev")
}

/*
------------------------- MONGOSE ----------------
import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;

export async function getMongoClient() {

   * Global is used here to maintain a cached connection across hot reloads
   * in development. This prevents connections growing exponentiatlly
   * during API Route usage.
   * https://github.com/vercel/next.js/pull/17666

  if (!global._mongoClientPromise) {
    global._mongoClientPromise = mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  }
  console.log('Return MongoPromise');
  return global._mongoClientPromise;
}

export async function getMongoDb() {
  await getMongoClient();
  return mongoose.connection.db;
}

-----------------------------------MONGOOSE AND MONGODB ------------------------

import { MongoClient, Db } from 'mongodb';
import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;

let mongoDb: Db;

export async function getMongoClient() {
  /**
   * Global is used here to maintain a cached connection across hot reloads
   * in development. This prevents connections growing exponentiatlly
   * during API Route usage.
   * https://github.com/vercel/next.js/pull/17666

  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    global._mongoClientPromise = client.connect();
    console.log('Connected to MongoDB');
    mongoDb = client.db('dev');
    mongoose.connect(uri, {
      dbName: 'dev',
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
  console.log('Return MongoPromise');
  return global._mongoClientPromise;
}

export async function getMongoDb() {
  await getMongoClient();
  return mongoDb;
}

export async function getMongooseDb() {
  await getMongoClient();
  return mongoose.connection.db;
}

*/
