const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const auth = require('../middleware/authMiddleware');
const { v4: uuidv4 } = require('uuid');

router.post('/', auth, async (req, res) => {
  const { restaurantId, rating, comment } = req.body;
  if (!restaurantId || !rating || rating < 1 || rating > 5)
    return res.status(400).json({ message: "Missing required fields or invalid rating (1–5)." });

  const exists = await Review.findOne({ restaurantId, userId: req.user.userId });
  if (exists) return res.status(409).json({ message: "User has already reviewed this restaurant." });

  const review = new Review({
    reviewId: uuidv4(),
    restaurantId,
    userId: req.user.userId,
    rating,
    comment
  });

  await review.save();
  res.status(201).json({ message: "Review submitted successfully", reviewId: review.reviewId });
});

router.delete('/:id', auth, async (req, res) => {
  const review = await Review.findOne({ reviewId: req.params.id });
  if (!review) return res.status(404).json({ message: "Review not found." });

  if (review.userId !== req.user.userId)
    return res.status(403).json({ message: "User not authorized to delete this review." });

  await Review.deleteOne({ reviewId: req.params.id });
  res.status(200).json({ message: "Review deleted successfully" });
});

module.exports = router;
