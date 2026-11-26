import "dotenv/config";
import cors from "cors";
import express from "express";
import connectDB from "./src/config/db.js";
import { errorHandler, notFound } from "./src/middlewares/errorMiddleware.js";
import appointmentRoutes from "./src/routes/appointmentRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API REST de Barberia J-M operativa",
    endpoints: {
      appointments: "/api/appointments",
      users: "/api/users",
    },
  });
});

app.use("/api/appointments", appointmentRoutes);
app.use("/api/users", userRoutes);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3000;
if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`API disponible en http://localhost:${port}`);
  });
}


export default app;
