import express from "express";
import { getShows, getShowById } from "../controllers/showController.js";

const router = express.Router();

// ✅ Single show by ID (Seat selection)
router.get("/show/:id", getShowById);

// ✅ Shows by movie ID
router.get("/movie/:movieId", getShows);

export default router;
