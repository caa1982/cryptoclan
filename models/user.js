const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  email: String,
  password: String,
  name: String,
  company: String,
  website: String,
  bio: String,
  address: String,
  city: String,
  facebookId: Number,
  photo: String,
  linkedinId: String,
  poloniex: {apikey: String, apisecret: String},
  bittrex: {apikey: String, apisecret: String},
  portfolio: Array,
  coins : Array
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
