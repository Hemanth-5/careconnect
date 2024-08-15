import mongoose from "mongoose";

const facilityResourceSchema = new mongoose.Schema(
  {
    facilityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Facility",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    availablity: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const FacilityResource = mongoose.model(
  "FacilityResource",
  facilityResourceSchema
);

export default FacilityResource;

// Description of the facility resource model:
// The facility resource model consists of the following fields:
// facilityId: The ID of the facility to which the resource belongs.
// name: The name of the resource.
// type: The type or category of the resource.
// availability: The availability status of the resource.
// quantity: The quantity or amount of the resource available.
// date: The date the resource information was updated.
