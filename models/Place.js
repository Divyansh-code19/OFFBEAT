const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },

      coordinates: {
        type: [Number],
        required: true,
      },
    },

    images: {
      type: [String],
      default: [],
    },

    difficulty: {
      type: String,
      required: true,
    },

    cost: {
      type: Number,
      default: 0,
    },

    bestTime: {
      type: String,
      default: "",
    },

    bestSeason: {
      type: String,
      default: "",
    },

    crowdLevel: {
      type: String,
      required: true,
    },

    howToReach: {
      type: String,
      default: "",
    },

    safetyInformation: {
      type: String,
      default: "",
    },

    rating: {
      type: Number,
      default: 0,
    },

    reviewCount: {
      type: Number,
      default: 0,
    },

    offbeatScore: {
      type: Number,
      default: 0,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

placeSchema.index({ location: "2dsphere" });

const Place = mongoose.model("Place", placeSchema);

module.exports = Place;