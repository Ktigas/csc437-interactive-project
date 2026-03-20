import { connectToDatabase, closeConnection } from "./db.js";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from parent directory
dotenv.config({ path: join(__dirname, '../.env') });

async function testConnection() {
  console.log("Testing MongoDB Atlas connection...\n");
  console.log("Configuration:");
  console.log(`  User: ${process.env.MONGO_USER}`);
  console.log(`  Cluster: ${process.env.MONGO_CLUSTER}`);
  console.log(`  Database: ${process.env.DB_NAME}`);
  console.log(`  Collections: ${process.env.USERS_COLLECTION_NAME}, ${process.env.REVIEWS_COLLECTION_NAME}\n`);
  
  try {
    const db = await connectToDatabase();
    console.log("Successfully connected to database\n");
    
    const collections = await db.listCollections().toArray();
    console.log("Existing collections:", collections.map(c => c.name).join(", ") || "(none)");
    
    const testCollection = db.collection("_test_connection");
    await testCollection.insertOne({ 
      test: true, 
      timestamp: new Date(),
      message: "Connection test successful"
    });
    console.log("Successfully wrote to database");
    
    const result = await testCollection.findOne({ test: true });
    console.log("Successfully read from database");
    
    await testCollection.drop();
    console.log("Cleaned up test data\n");
    
    console.log("All tests passed. Database connection is working correctly.\n");
    
    await closeConnection();
  } catch (error) {
    console.error("Test failed:", error);
    console.error("\nTroubleshooting tips:");
    console.error("1. Check if IP address is whitelisted in MongoDB Atlas Network Access");
    console.error("2. Verify username and password are correct in .env file");
    console.error("3. Ensure cluster name is correct in MONGO_CLUSTER");
    console.error("4. Check if database user has read/write permissions");
    console.error("5. Make sure the database name exists or will be created automatically");
    process.exit(1);
  }
}

testConnection();