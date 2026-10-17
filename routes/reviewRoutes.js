const express = require("express");

const {
  createReview,
  getReviews,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:placeId/reviews", protect, createReview);

router.get("/:placeId/reviews", getReviews);

router.put("/reviews/:reviewId", protect, updateReview);

router.delete("/reviews/:reviewId", protect, deleteReview);

module.exports = router;