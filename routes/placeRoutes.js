const express = require("express");

const {
  createPlace,
  getPlaces,
  getPlaceById,
  updatePlace,
  deletePlace,
  savePlace,
  unsavePlace,
  getSavedPlaces,
} = require("../controllers/placeController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createPlace);

router.get("/", getPlaces);

router.get("/saved", protect, getSavedPlaces);

router.get("/:id", getPlaceById);

router.put("/:id", protect, updatePlace);

router.delete("/:id", protect, deletePlace);

router.post("/:placeId/save", protect, savePlace);

router.delete("/:placeId/save", protect, unsavePlace);

module.exports = router;