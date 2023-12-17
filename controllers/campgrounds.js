const Campground = require("../models/campground"); //모델 가져와!
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

//INDEX
module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  //템플릿에 전달
  res.render("campgrounds/index", { campgrounds }); //views/campgrounds/index.ejs 생성
};

//CREATE(GET)
module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

//CREATE(POST)
module.exports.createCampground = async (req, res, next) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();
  // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
  const campground = new Campground(req.body.campground); //모델 만들기
  campground.geometry = geoData.body.features[0].geometry; //map
  //image를 위한 file 파싱
  campground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.author = req.user._id; //현재 로그인한 사람이 만든 것으로 나타내기 위해서
  await campground.save();
  console.log(campground);
  req.flash("success", "SUCCESSFULLY MADE A NEW CAMPGROUND!");
  res.redirect(`/campgrounds/${campground._id}`);
};

//SHOW
module.exports.showCampground = async (req, res) => {
  //req.params.id의 값으로 db에서 상세 정보 찾기
  const campground = await Campground.findById(req.params.id)
    .populate({
      //review populate
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author"); //campgorund populate
  console.log(campground);
  if (!campground) {
    req.flash("error", "CANNOT FIND THAT CAMPGROUND");
    return res.redirect("/campgrounds");
  }
  //id로 데이터베이스에서 알맞은 캠핑장 찾을 것
  res.render("campgrounds/show", { campground });
};

//EDIT(GET)
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    //edit에 들어가지도 못하게 함
    req.flash("error", "CANNOT FIND THAT CAMPGROUND");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
};

//EDIT(PUT)
module.exports.updateCampground = async (req, res) => {
  const { id } = req.params; //destructure
  console.log(req.body);
  //db에서 id와 일치하는 것을 찾아서 req.body.campground에서 그룹되어있는 것들 spread하여 반영
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.images.push(...imgs);
  await campground.save();
  if (req.body.deleteImages) {
    //cloudinary에서 삭제
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
    console.log(campground);
  }
  req.flash("success", "SUCCESSFULLY UPDATED CAMPGROUND");
  res.redirect(`/campgrounds/${campground._id}`);
};

//DELETE
module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id); //trigger: findOneAndDelete() => 연쇄삭제할 때 사용할 것
  req.flash("success", "SUCCESSFULLY DELETED CAMPGROUND");
  res.redirect("/campgrounds");
};
