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
  location: { type: { type: String }, coordinates: [Number] },
  facebookId: Number,
  photo: String,
  linkedinId: String,
  poloniex: {apikey: String, apisecret: String},
  bittrex: {apikey: String, apisecret: String},
  portfolio: Object,
  fake: Boolean,
  coins : Array
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});
userSchema.index({ location: '2dsphere' });

const User = mongoose.model("User", userSchema);

module.exports = User;
