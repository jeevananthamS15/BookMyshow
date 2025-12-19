import Show from "../models/Show.js";
import redis from "../config/redis.js";

export const getShows = async (req, res) => {
  try {
    const key = `shows:${req.params.movieId}`;
    const cached = await redis.get(key);
    if (cached) return res.json(JSON.parse(cached));

    const shows = await Show.find({ movieId: req.params.movieId });
    await redis.set(key, JSON.stringify(shows), { EX: 3600 });

    res.json(shows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getShowById = async (req, res) => {
  try {
    const key = `show:${req.params.id}`;
    const cached = await redis.get(key);
    if (cached) return res.json(JSON.parse(cached));

    const show = await Show.findById(req.params.id);
    if (!show) return res.status(404).json({ message: "Show not found" });

    await redis.set(key, JSON.stringify(show), { EX: 3600 });
    res.json(show);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};