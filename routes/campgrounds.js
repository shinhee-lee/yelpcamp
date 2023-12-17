const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground"); //모델 가져와!
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const campgrounds = require("../controllers/campgrounds");
const multer = require("multer"); //파일 req.body 파싱
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router
  .route("/")
  //INDEX: 기본 페이지
  .get(catchAsync(campgrounds.index))
  //CREATE (POST)
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
    catchAsync(campgrounds.createCampground)
  );
//이름이 image인 파일(new.ejs)을 multer로 처리, req에 file 속성을 추가하고 body 나머지에도 추가

//CREATE (GET)
//show의 id와 충돌되지 않게 show 위에 선언
router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router
  .route("/:id")
  //SHOW: 각 캠핑장 상세 페이지
  .get(catchAsync(campgrounds.showCampground))
  //EDIT (PUT)
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCampground,
    catchAsync(campgrounds.updateCampground)
  )
  //DELETE
  .delete(isLoggedIn, catchAsync(campgrounds.deleteCampground));

//EDIT (GET)
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);

module.exports = router;
