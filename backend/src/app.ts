import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { router as apiRouter } from "./routes";
dotenv.config();

export const app = express();

app.get("/health", (_req, res) => res.json({ ok: true }));


app.use(cors({ origin: process.env.CORS_ORIGIN || true }));
app.use(express.json());

app.use("/api", apiRouter);

app.use((_req, res) => res.status(404).json({ message: "Not found" }));
