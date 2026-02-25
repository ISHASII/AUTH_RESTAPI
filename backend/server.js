import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "API Autentikasi berjalan dengan baik!",
    endpoints: {
      register: "POST /api/auth/register - Daftar akun baru",
      login: "POST /api/auth/login - Masuk ke akun",
      profile: "GET /api/user/profile (memerlukan header Authorization)",
    },
  });
});

app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB nya konek masseh"))
  .catch((err) => console.log(err));

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`),
);
