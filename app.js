//cloudinary information
//개발자 모드라면 require 하기
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

//express, path, mongoose, app, model, connect, app.set, app.listen, app.get 등
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate"); //navbar, footer같은거 파일 분할하지 말고 이걸로 하자
const session = require("express-session");
const flash = require("connect-flash");
const Joi = require("joi"); //유효성 검사 => schema.js로...
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override"); //put 요청이지만 post인 것처럼!
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const MongoStore = require("connect-mongo");

//SECURITY
const mongoSanitize = require("express-mongo-sanitize"); //mongo injection 방지
const helmet = require("helmet");

const userRoutes = require("./routes/users");
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");

//DB에 mongoose 연결
const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/yelp-camp";
//+ useFindAndModify: false ??

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

//ejsmate 선언
//디폴트 대신 이걸 사용하라고 설정해줘야 함
app.engine("ejs", ejsMate);
//ejs 선언
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); //경로 확실히 해줌

//post할 때 사용되는 req.body 파싱
//요청의 본문에 있는 데이터가 URL-encoded 형식의 문자열로 넘어오기 때문에 객체로의 변환이 필요
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method")); //메서드 오버라이드할 때 쿼리 문자열로 사용할 문자열
app.use(express.static(path.join(__dirname, "public"))); //static Asset을 위한 선언 (예: html과 html에 있던 js의 분리)
app.use(mongoSanitize({ replaceWith: "_" }));

//***********************************SESSION & FLASH*************************************
const secret = process.env.SECRET || "thisshouldbeabettersecret";

const store = MongoStore.create({
  mongoUrl: dbUrl,
  secret,
  touchAfter: 24 * 60 * 60, //불필요한 업데이트 하지 말고 touchafter 시간에 한 번씩 업데이트
  crypto: {
    secret: "thisshouldbeabettersecret",
  },
});
store.on("error", function (e) {
  console.log("SESSION STORE ERROR", e);
});

const sessionConfig = {
  store,
  name: "snyoong", //session id 이름을 connect.sid에서 snyoong으로 바꿈 >> 해킹 방해
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true, //기본적인 보안 (XSS 취약점 해결) - javascript에서 액세스하지 못한다는 뜻
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //일주일 후에 세션 만료됨
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

//***************************************HELMET*****************************************
app.use(helmet());
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://cdn.jsdelivr.net",
];
const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [
  "https://api.mapbox.com/",
  "https://a.tiles.mapbox.com/",
  "https://b.tiles.mapbox.com/",
  "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
  helmet.contentSecurityPolicy({
    //우리가 만든 옵션 전달
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com/dcy25lcqz/",
        "https://images.unsplash.com/",
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);
// app.use(helmet({ contentSecurityPolicy: false })); //SECURITY
// app.use(
//   helmet({
//     crossOriginEmbedderPolicy: false,
//     crossOriginResourcePolicy: {
//       allowOrigins: ["*"],
//     },
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: [],
//         connectSrc: ["'self'", ...connectSrcUrls],
//         scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
//         styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
//         workerSrc: ["'self'", "blob:"],
//         objectSrc: [],
//         imgSrc: [
//           "'self'",
//           "blob:",
//           "data:",
//           "https://res.cloudinary.com/dxdfxjqvz/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
//           "https://images.unsplash.com/",
//         ],
//         fontSrc: ["'self'", ...fontSrcUrls],
//       },
//     },
//   })
// );

//****************************************************************************************

//***************************************PASSPORT*****************************************
//PASSPORT
app.use(passport.initialize());
//영구 로그인 세션을 원한다면 session + session()은 passport.session 전에 사용해야 함
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); //우리가 다운로드하고 요청한 localstrategy를 사용해 주겠니?

passport.serializeUser(User.serializeUser()); //passport에게 사용자 직렬화 방법 알려줌
passport.deserializeUser(User.deserializeUser());
//****************************************************************************************

app.use((req, res, next) => {
  //+req.user로 사용자에 대한 정보를 쉽게 얻기
  //+위의 방법으로 password나 salt 없는 정보 얻을 수 있음
  res.locals.currentUser = req.user; //모든 템플릿에서 currentUser에 접근해야 함 >> navbar.ejs로 ㄱㄱ
  res.locals.success = req.flash("success"); //success가 무엇이든 템플릿에 자동으로 접근해서 따로 접근할 필요 없음 (미들웨어의 장점)
  res.locals.error = req.flash("error");
  next();
});
//****************************************************************************************

//HOME
app.get("/", (req, res) => {
  res.render("home");
});

app.use("/", userRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes); //여기서 :id부분 때문에 reviews.js에서 mergeParams 해줘야 함

//*****************************************ERROR******************************************
//위치 중요! >> 상단의 모든 코드에 요청이 닿지 않는 경우에 실행
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

//Basic Custom Error Handler
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(statusCode).render("error", { err });
});
//****************************************************************************************

const port = process.env.PORT || 3000;
//PORT
app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});
