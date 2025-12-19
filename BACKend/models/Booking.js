import mongoose from "mongoose";


export default mongoose.model(
"Booking",
new mongoose.Schema({
userId: mongoose.Schema.Types.ObjectId,
showId: mongoose.Schema.Types.ObjectId,
seats: [String],
totalAmount: Number,
bookingTime: { type: Date, default: Date.now }
})
);