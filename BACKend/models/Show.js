import mongoose from "mongoose";


export default mongoose.model(
"Show",
new mongoose.Schema({
movieId: mongoose.Schema.Types.ObjectId,
theatre: String,
location: String,
timing: Date,
price: Number,
seats: [{ seatNo: String, isBooked: Boolean }]
})
);