import Gigs from "../models/gigModel.js";
import createError from "../error.js";

export const createGig = async (req, res, next) => {
  if (!req.isSeller) {
    return next(createError(403, "Only sellers can create a gig"));
  }

  const newGig = new Gigs({ userId: req.userId, ...req.body });
  try {
    const savedGig = await newGig.save();
    res.status(201).send(savedGig);
  } catch (error) {
    next(error);
  }
};

export const deleteGig = async (req, res, next) => {
  try {
    const gig = await Gigs.findById(req.params.id);
    if (gig.userId !== req.userId) {
      next(createError(403, "You can delete only your gig"));
    }

    await Gigs.findByIdAndDelete(req.params.id);
    res.status(200).send("Gig deleted successfully");
  } catch (error) {
    next(error);
  }
};
export const getGig = async (req, res, next) => {
  try {
    const gig = await Gigs.findById(req.params.id);
    if (!gig) {
      next(createError(404, "not found"));
    }
    res.status(200).send(gig);
  } catch (error) {
    next(error);
  }
};

// todo fetch by sort
export const getGigs = async (req, res, next) => {
  const q = req.query;

  const filters = {
    ...(q.userId && { userId: q.userId }),
    ...(q.cat && { cat: q.cat }),
    ...((q.min || q.max) && {
      price: { ...(q.min && { $gt: q.min }), ...(q.max && { $lt: q.max }) },
    }),
    ...(q.search && { title: { $regex: q.search, $options: "i" } }),
  };
  try {
    const gigs = await Gigs.find(filters).sort({ [q.sort]: -1 });

    res.status(200).send(gigs);
  } catch (error) {
    next(error);
  }
};
