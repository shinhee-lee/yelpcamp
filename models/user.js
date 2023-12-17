const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

//패키지가 불러온 결과를 스키마에 전달= > 사용자 이름, password 등 저장 + 중복 확인 등 + 메서드 사용도 가능
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
