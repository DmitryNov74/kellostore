import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    modelOf: {
      type: String,
      required: true,
    },
    isFullSet: {
      type: Boolean,
      required: true,
    },
    movement: {
      type: String,
      required: true,
    },
    locationOf: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    condition: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrls: {
      type: Array,
      required: true,
    },
    userRef: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Listing = mongoose.model('Listing', listingSchema);
export default Listing;
