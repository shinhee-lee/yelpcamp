const User = require("../models/user");

//INDEX
module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};

//REGISTER(POST)
module.exports.register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      //register하고 바로 로그인 상태로 되도록하는 passport의 메서드
      if (err) return next(err);
      req.flash("success", "welcome to yelp camp!");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

//LOGIN(GET)
module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

//LOGIN(POST)
module.exports.login = (req, res) => {
  req.flash("success", "welcome back!");
  const redirectUrl = res.locals.returnTo || "/campgrounds";
  delete res.locals.returnTo;
  res.redirect(redirectUrl);
};

//LOGOUT
module.exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/campgrounds");
  });
};
