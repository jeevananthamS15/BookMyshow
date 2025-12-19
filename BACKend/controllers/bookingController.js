import Booking from "../models/Booking.js";
import Show from "../models/Show.js";

export const bookSeats = async (req, res) => {
  try {
    const { showId, seats } = req.body;

    // 0️⃣ Validate input
    if (!showId || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ message: "Invalid seat selection" });
    }

    // 1️⃣ Get show
    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }

    // 2️⃣ Check ALL selected seats availability
    const alreadyBookedSeats = show.seats.filter(
      seat => seats.includes(seat.seatNo) && seat.isBooked
    );

    if (alreadyBookedSeats.length > 0) {
      return res.status(400).json({
        message: `Seats already booked: ${alreadyBookedSeats
          .map(s => s.seatNo)
          .join(", ")}`
      });
    }

    // 3️⃣ Mark selected seats as booked
    show.seats = show.seats.map(seat =>
      seats.includes(seat.seatNo)
        ? { ...seat.toObject(), isBooked: true }
        : seat
    );

    await show.save();

    // 4️⃣ Create booking
    const booking = await Booking.create({
      userId: req.user.id,
      showId,
      seats,
      totalAmount: seats.length * show.price
    });

    res.status(201).json({
      message: "Booking successful",
      booking
    });
  } catch (err) {
    console.error("Booking Error:", err);
    res.status(500).json({ message: "Booking failed. Try again." });
  }
};

export const myBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id }).sort({
      bookingTime: -1
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
