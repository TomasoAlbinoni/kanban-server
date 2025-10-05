import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.js";
import tasksRouter from "./routes/tasks.js";
import { authenticateToken, adminMiddleware } from "./middleware/auth.js";
import { PORT, } from "./config.js";

const app = express();

app.use(cors());
app.use(express.json())

app.use("/auth", authRouter);
app.use("/tasks", authenticateToken, tasksRouter);

// Start the Express server
app.listen(PORT, () => {
    console.log(`The server is running at http://localhost:${PORT}`);
});