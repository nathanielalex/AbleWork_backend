import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import cors from "cors";
import jobRoutes from "./routes/job.route.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import companyRoutes from "./routes/company.route.js";
import userDetailRoutes from "./routes/userDetail.route.js";
import saveJobRoutes from "./routes/saveJob.route.js";
import applicationRoutes from "./routes/application.route.js";
import messageRoutes from "./routes/message.route.js";
import chatRoutes from "./routes/chatbot.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

// COMMENT: This middleware is used to parse incoming requests with JSON payloads.
const corsOption = {
  origin: ["https://ablework.vercel.app", "http://localhost:5173"],
  credentials: true,
};

app.use(cors(corsOption));

app.get("/", (req, res) => res.send("Express on Vercel"));

// COMMENT: This is where all the routes are defined and linked to their respective controllers.
app.use("/api/jobs", jobRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/userDetail", userDetailRoutes);
app.use("/api/saveJob", saveJobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/chat", chatRoutes);

// COMMENT: This is where the database connection is established and the server starts listening on the specified port.
connectDB()
  .then(() => {
    // Once the database connection is successful, start the server
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to database:", err);
    process.exit(1);
  });

export default app;
