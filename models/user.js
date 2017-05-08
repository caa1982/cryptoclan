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
  poloniex: [{apikey: String, apisecrect: String}],
  bittrex: [{apikey: String, apisecrect: String}],
  portfolio: Array,
  coins : [{ type: Schema.Types.ObjectId, ref: 'Coin' }]
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
