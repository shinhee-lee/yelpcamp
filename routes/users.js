const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");

const { storeReturnTo } = require("../middleware");
const users = require("../controllers/users");

router
  .route("/register")
  //REGISTER
  .get(users.renderRegister)
  //오류 페이지로 넘어가지 않고 register에 flash만 띄우도록 try-catch문
  .post(catchAsync(users.register));

router
  .route("/login")
  //LOGIN
  .get(users.renderLogin)
  .post(
    storeReturnTo,
    passport.authenticate("local", {
      //passport의 authenticate 메서드 사용
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.login
  );

//LOGOUT
router.get("/logout", users.logout);

module.exports = router;
