const Review = require("../models/Review");
const Place = require("../models/place");

// Create a review
const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { placeId } = req.params;

    if (!rating || !comment) {
      return res.status(400).json({
        message: "Rating and comment are required",
      });
    }

    const place = await Place.findById(placeId);

    if (!place) {
      return res.status(404).json({
        message: "Place not found",
      });
    }

    const review = await Review.create({
      place: placeId,
      user: req.user.userId,
      rating,
      comment,
    });

    // Recalculate rating
    const reviews = await Review.find({
      place: placeId,
    });

    const totalRating = reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );

    const averageRating = totalRating / reviews.length;

    place.rating = Number(averageRating.toFixed(1));
    place.reviewCount = reviews.length;

    await place.save();

    res.status(201).json({
      message: "Review created successfully",
      review,
      rating: place.rating,
      reviewCount: place.reviewCount,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "You have already reviewed this place",
      });
    }

    res.status(500).json({
      message: error.message,
    });
  }
};


// Get reviews for a place
const getReviews = async (req, res) => {
  try {
    const { placeId } = req.params;

    const reviews = await Review.find({
      place: placeId,
    })
      .populate("user", "name profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// Update a review
const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    // Only the review owner can update it
    if (review.user.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You are not allowed to update this review",
      });
    }

    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          message: "Rating must be between 1 and 5",
        });
      }

      review.rating = rating;
    }

    if (comment !== undefined) {
      review.comment = comment;
    }

    await review.save();

    // Recalculate place rating
    const reviews = await Review.find({
      place: review.place,
    });

    const totalRating = reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );

    const averageRating = totalRating / reviews.length;

    const place = await Place.findById(review.place);

    place.rating = Number(averageRating.toFixed(1));
    place.reviewCount = reviews.length;

    await place.save();

    res.status(200).json({
      message: "Review updated successfully",
      review,
      rating: place.rating,
      reviewCount: place.reviewCount,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// Delete a review
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    // Only the review owner can delete it
    if (review.user.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You are not allowed to delete this review",
      });
    }

    const placeId = review.place;

    await Review.findByIdAndDelete(reviewId);

    // Recalculate place rating
    const reviews = await Review.find({
      place: placeId,
    });

    const place = await Place.findById(placeId);

    if (reviews.length === 0) {
      place.rating = 0;
      place.reviewCount = 0;
    } else {
      const totalRating = reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );

      const averageRating = totalRating / reviews.length;

      place.rating = Number(averageRating.toFixed(1));
      place.reviewCount = reviews.length;
    }

    await place.save();

    res.status(200).json({
      message: "Review deleted successfully",
      rating: place.rating,
      reviewCount: place.reviewCount,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


module.exports = {
  createReview,
  getReviews,
  updateReview,
  deleteReview,
};