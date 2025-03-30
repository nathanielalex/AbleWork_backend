import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import cors from "cors";
import jobRoutes from "./routes/job.route.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// console.log(process.env.MONGO_URI)

app.use(express.json());

const corsOption = {
  origin: ["http://localhost:5173"],
  //5173 is where vite runs
};

app.use(cors(corsOption));

app.use("/api/jobs", jobRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log("server started on port 8080");
});
