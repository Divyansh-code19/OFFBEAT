const express = require("express");

const {
  createReport,
} = require("../controllers/reportController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:placeId/reports", protect, createReport);

module.exports = router;