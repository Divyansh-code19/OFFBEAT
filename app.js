const express = require("express");

const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const placeRoutes = require("./routes/placeRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Offbeat API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/places", placeRoutes);
app.use("/api/places", reviewRoutes);
app.use("/api/places", reportRoutes);

module.exports = app;