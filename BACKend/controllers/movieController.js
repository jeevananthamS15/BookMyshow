import Movie from "../models/Movie.js";
import redis from "../config/redis.js";

/* ======================
   GET ALL MOVIES
====================== */
export const getMovies = async (req, res) => {
  try {
    const cached = await redis.get("movies");
    if (cached) return res.json(JSON.parse(cached));

    const movies = await Movie.find();
    await redis.set("movies", JSON.stringify(movies), { EX: 3600 });

    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ======================
   GET MOVIE BY ID
====================== */
export const getMovieById = async (req, res) => {
  try {
    const key = `movie:${req.params.id}`;
    const cached = await redis.get(key);
    if (cached) return res.json(JSON.parse(cached));

    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    await redis.set(key, JSON.stringify(movie), { EX: 3600 });
    res.json(movie);
  } catch (err) {
    res.status(400).json({ message: "Invalid movie ID" });
  }
};