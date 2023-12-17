const express = require("express");
const router = express.Router({ mergeParams: true }); //app.js와 reviews.js의 매개변수가 통합됨
const catchAsync = require("../utils/catchAsync");
const Review = require("../models/review");
const Campground = require("../models/campground");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const reviews = require("../controllers/reviews");

//CREATE
router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

//DELETE
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
