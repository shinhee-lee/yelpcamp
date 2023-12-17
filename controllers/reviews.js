const Review = require("../models/review");
const Campground = require("../models/campground");

//CREATE
module.exports.createReview = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  campground.reviews.push(review); //그냥 하면 여기서 null에러 뜸 (id로 campground 못 찾겠다고 함) => 라우터가 분리됐기 때문
  await review.save();
  await campground.save();
  req.flash("success", "CREATED NEW REVIEW");
  res.redirect(`/campgrounds/${campground._id}`);
};

//DELETE
module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  //$pull: 배열의 모든 인스턴스 중 특정 조건에 만족하는 값 지움
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "SUCCESSFULLY DELETED REVIEW");
  res.redirect(`/campgrounds/${id}`);
};
