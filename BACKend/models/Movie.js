import mongoose from "mongoose";


export default mongoose.model(
"Movie",
new mongoose.Schema({
title: String,
description: String,
poster: String,
genre: [String],
duration: Number
})
);