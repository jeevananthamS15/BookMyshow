import express from "express";
import { bookSeats, myBookings } from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();
router.post("/", protect, bookSeats);
router.get("/me", protect, myBookings);
export default router;