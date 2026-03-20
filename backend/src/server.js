import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectToDatabase, setupIndexes } from "./db.js";
import authRoutes from "./routes/auth.js";
import reviewRoutes from "./routes/reviews.js";
import { authenticateToken } from "./middleware/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

let dbReady = false;
let dbError = null;

async function initializeDatabase() {
  try {
    await connectToDatabase();
    await setupIndexes();
    dbReady = true;
    console.log("Database ready");
  } catch (error) {
    console.error("Database initialization failed:", error);
    dbError = error.message;
  }
}

app.use((req, res, next) => {
  if (!dbReady && req.path !== '/api/health') {
    return res.status(503).json({ 
      error: "Database connecting, please try again",
      details: dbError 
    });
  }
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/reviews", authenticateToken, reviewRoutes);

app.get("/api/health", (req, res) => {
  res.json({ 
    status: dbReady ? "ok" : "degraded",
    message: dbReady ? "Server is running" : "Database connecting",
    database: dbReady ? "connected" : "connecting",
    timestamp: new Date().toISOString()
  });
});

app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ error: "Internal server error" });
});

initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);
    console.log(`Database: ${process.env.DB_NAME}`);
  });
}).catch(error => {
  console.error("Failed to start server:", error);
  process.exit(1);
});