const mongoose = require("mongoose")
const Schema = mongoose.Schema

const UserSchema = new Schema({
  availability: {type: String},
  googleID: {type: String, unique: true},
  username: {type: String, required: true},
  userImage: {type: String},
  userImage: {type: String},
  email: {type: String},
})

const User = mongoose.model("User", UserSchema)
module.exports = User
