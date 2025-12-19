import express from "express";
import cors from "cors";
import morgan from "morgan";


import authRoutes from "./routes/authRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";
import showRoutes from "./routes/showRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import errorHandler from "./middleware/errorHandler.js";


const app = express();
app.use(express.json());
const allowedOrigins = [
  "https://bookmyshow-wryg.onrender.com", // frontend domain
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(morgan("dev"));


app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/shows", showRoutes);
app.use("/api/bookings", bookingRoutes);
app.use(errorHandler);


export default app;