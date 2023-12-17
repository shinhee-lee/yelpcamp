const ExpressError = require("./utils/ExpressError");
const { campgroundSchema, reviewSchema } = require("./schemas.js");
const Campground = require("./models/campground"); //모델 가져와!
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
  //로그인 안되어있으면 login페이지로 이동
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl; //동작을 요청한 페이지로 이동하기 위해(로그인하고 나면 무조건 campgrounds로 가는 문제)

    req.flash("error", "you must be signed in first!");
    return res.redirect("/login");
  }
  next();
};

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

//*************************************JOI MIDDLEWARE*************************************
module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
//****************************************************************************************

//*************************************AUTHORIZATION*************************************

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "YOU DONT HAVE PERMISSION");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "YOU DONT HAVE PERMISSION");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};
//****************************************************************************************
