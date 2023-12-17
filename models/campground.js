//mongoose, Schema, model, export
const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

//썸네일
const ImageSchema = new Schema({
  url: String,
  filename: String,
});
ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
}); //edit 시 사진 크기 맞추기 위해 => 데이터베이스에 반영할 필요 없어서 virtual로 함 // w_200은 cloudinary의 image api

//default로 mongoose는 문서를 json으로 변환할 때 virtual을 포함하지 않음
//따라서 아래의 option 설정 필요
const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema(
  {
    title: String,
    images: [ImageSchema],
    geometry: {
      type: {
        type: String,
        enum: ["Point"], //GeoJson
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    price: Number,
    description: String,
    location: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    //review 모델에서 온 objectid라는 뜻
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  opts
);

//지도에서 popup할 virtual 정보
CampgroundSchema.virtual("properties.popUpMarkup").get(function () {
  return `
  <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
  <p>${this.description.substring(0, 20)}...</p>
  <p>${this.location}</p>`; //마크업은 동적이라서 볼드 처리(strong)로 개선 가능
});

//캠핑장 삭제되면 그에 딸린 댓글들도 삭제
CampgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    //doc이 갖고 있는 리뷰 중 리뷰 배열에서 삭제된 id 필드를 가진 모든 리뷰 삭제
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
