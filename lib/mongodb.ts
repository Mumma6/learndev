import { MongoClient } from "mongodb"

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
const options = {}

let indexesCreated = false
async function createIndexes(client: MongoClient) {
  if (indexesCreated) return client
  const db = client.db("dev")
  await Promise.all([
    //db.collection("tokens").createIndex({ expireAt: -1 }, { expireAfterSeconds: 0 }),
    // db.collection("posts").createIndexes([{ key: { createdAt: -1 } }, { key: { creatorId: -1 } }]),
    // db.collection("comments").createIndexes([{ key: { createdAt: -1 } }, { key: { postId: -1 } }]),
    //db.collection("users").createIndexes([{ key: { email: 1 }, unique: true }]),
  ])
  indexesCreated = true
  return client
}

export async function getMongoClient() {
  /**
   * Global is used here to maintain a cached connection across hot reloads
   * in development. This prevents connections growing exponentiatlly
   * during API Route usage.
   * https://github.com/vercel/next.js/pull/17666
   */
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri)
    // client.connect() returns an instance of MongoClient when resolved
    global._mongoClientPromise = client.connect().then((client) => createIndexes(client))
  }
  console.log("Connected to MongoDB")
  return global._mongoClientPromise
}

export async function getMongoDb() {
  const mongoClient = await getMongoClient()
  return mongoClient.db("dev")
}

/*

let client
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

console.log("connect to MongoDB")

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise

*/
