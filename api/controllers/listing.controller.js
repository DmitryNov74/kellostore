import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, 'Kokoelmaa ei löytynyt'));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'Voit poistaa vain oman kokoelman'));
  }
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('kokoelma on poistettu');
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, 'Kokoelmaa ei löytynyt'));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'Voit muokata vain omaa kokoelmaa'));
  }
  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Kokoelma ei löytynyt'));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let isFullSet = req.query.isFullSet;
    if (isFullSet === undefined || isFullSet === false) {
      isFullSet = { $in: [false, true] };
    }
    let movement = req.query.movement;
    if (
      movement === undefined ||
      movement === 'quartz' ||
      movement === 'automatic'
    ) {
      movement = { $in: ['quartz', 'automatic'] };
    }
    const searchTerm = req.query.searchTerm || '';

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: 'i' },
      isFullSet,
      movement,
    })
      .limit(limit)
      .skip(startIndex);
    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
