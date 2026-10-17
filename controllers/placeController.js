const Place = require("../models/place");
const User = require("../models/User");

const createPlace = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      location,
      images,
      difficulty,
      cost,
      bestTime,
      bestSeason,
      crowdLevel,
      howToReach, 
      safetyInformation,
    } = req.body;

    // Check required fields
    if (
      !name ||
      !description ||
      !category ||
      !location ||
      !difficulty ||
      !crowdLevel
    ) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    const place = await Place.create({
      name,
      description,
      category,
      location,
      images,
      difficulty,
      cost,
      bestTime,
      bestSeason,
      crowdLevel,
      howToReach,
      safetyInformation,

      // Get logged-in user's ID from JWT
      createdBy: req.user.userId,
    });

    res.status(201).json({
      message: "Place created successfully",
      place,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getPlaces = async (req, res) => {
  try {
    const places = await Place.find();

    res.status(200).json({
      count: places.length,
      places,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getPlaceById = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);

    if (!place) {
      return res.status(404).json({
        message: "Place not found",
      });
    }

    res.status(200).json({
      place,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updatePlace = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);

    if (!place) {
      return res.status(404).json({
        message: "Place not found",
      });
    }

    // Only the creator can update the place
    if (place.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You are not allowed to update this place",
      });
    }

    const updatedPlace = await Place.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      message: "Place updated successfully",
      place: updatedPlace,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deletePlace = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);

    if (!place) {
      return res.status(404).json({
        message: "Place not found",
      });
    }

    // Only the creator can delete the place
    if (place.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You are not allowed to delete this place",
      });
    }

    await Place.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Place deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const savePlace = async (req, res) => {
  try {
    const { placeId } = req.params;

    // Check if place exists
    const place = await Place.findById(placeId);

    if (!place) {
      return res.status(404).json({
        message: "Place not found",
      });
    }

    // Find logged-in user
    const user = await User.findById(req.user.userId);

    // Check if already saved
    if (user.savedPlaces.includes(placeId)) {
      return res.status(400).json({
        message: "Place already saved",
      });
    }

    // Add place to saved places
    user.savedPlaces.push(placeId);

    await user.save();

    res.status(200).json({
      message: "Place saved successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


const unsavePlace = async (req, res) => {
  try {
    const { placeId } = req.params;

    const user = await User.findById(req.user.userId);

    // Check if place is saved
    if (!user.savedPlaces.includes(placeId)) {
      return res.status(400).json({
        message: "Place is not saved",
      });
    }

    // Remove place
    user.savedPlaces = user.savedPlaces.filter(
      (id) => id.toString() !== placeId
    );

    await user.save();

    res.status(200).json({
      message: "Place removed from saved places",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getSavedPlaces = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate("savedPlaces");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      count: user.savedPlaces.length,
      places: user.savedPlaces,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createPlace,
  getPlaces,
  getPlaceById,
  updatePlace,
  deletePlace,
  savePlace,
  unsavePlace,
  getSavedPlaces,
};