import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from parent directory
dotenv.config({ path: join(__dirname, '../.env') });

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PWD}@${process.env.MONGO_CLUSTER}${process.env.MONGO_OPTIONS}`;

let client;
let db;

export async function connectToDatabase() {
  if (db) return db;
  
  try {
    client = new MongoClient(uri);
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    
    db = client.db(process.env.DB_NAME);
    console.log(`Using database: ${process.env.DB_NAME}`);
    
    return db;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

export async function getCollection(collectionName) {
  const database = await connectToDatabase();
  return database.collection(collectionName);
}

export async function closeConnection() {
  if (client) {
    await client.close();
    console.log("MongoDB connection closed");
  }
}

export async function setupIndexes() {
  try {
    const users = await getCollection(process.env.USERS_COLLECTION_NAME);
    const reviews = await getCollection(process.env.REVIEWS_COLLECTION_NAME);
    
    await users.createIndex({ email: 1 }, { unique: true });
    console.log("Created index on users.email");
    
    await reviews.createIndex({ userId: 1 });
    console.log("Created index on reviews.userId");
    
    await reviews.createIndex({ userId: 1, date: -1 });
    console.log("Created compound index on reviews.userId + date");
    
  } catch (error) {
    console.error("Error creating indexes:", error);
  }
}