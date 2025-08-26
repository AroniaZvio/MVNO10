import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { router as apiRouter } from "./routes";
dotenv.config();

export const app = express();

app.get("/health", (_req, res) => res.json({ ok: true }));

// Enhanced CORS configuration for mobile development
app.use(cors({ 
  origin: [
    'http://localhost:5173', 
    'http://localhost:3000', 
    'http://127.0.0.1:5173',
    'http://localhost:8081', // Expo development server
    'http://localhost:19006', // Expo Go
    'exp://localhost:19000',  // Expo Go
    // Add your computer's local IP for physical device testing
    'http://192.168.0.83:8081',
    'http://192.168.0.83:19006',
    'http://192.168.0.83:4000',
  ],
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Enhanced logging for all API requests
app.use("/api", (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`🌐 [${timestamp}] ${req.method} ${req.path} - Origin: ${req.headers.origin || 'unknown'}`);
  next();
}, apiRouter);

app.use((_req, res) => res.status(404).json({ message: "Not found" }));
