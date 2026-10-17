const Report = require("../models/Report");
const Place = require("../models/place");

const createReport = async (req, res) => {
  try {
    const { placeId } = req.params;
    const { reason, description } = req.body;

    if (!reason) {
      return res.status(400).json({
        message: "Report reason is required",
      });
    }

    const place = await Place.findById(placeId);

    if (!place) {
      return res.status(404).json({
        message: "Place not found",
      });
    }

    const report = await Report.create({
      place: placeId,
      reportedBy: req.user.userId,
      reason,
      description,
    });

    res.status(201).json({
      message: "Report submitted successfully",
      report,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createReport,
};