const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  email: String,
  password: String,
  name: String,
  education: String,
  skills: String,
  job: String,
  facebookId: Number,
  photo: String,
  linkedinId: String,
  coins : [{ type: Schema.Types.ObjectId, ref: 'Coin' }]
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const User = mongoose.model("User", userSchema);

module.exports = User;