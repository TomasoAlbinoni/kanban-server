import express from "express";
import type { Request } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth";
import tasksRouter from "@/routes/tasks";
import { authenticateToken, adminMiddleware } from "@/middleware/auth";

dotenv.config();

const app = express();

const port = process.env.PORT || 3000;

app.use(cors<Request>());
app.use(express.json())

app.use("/auth", authRouter);
app.use("/tasks", authenticateToken, tasksRouter);

// Start the Express server
app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}`);
});