const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const portfolioHistorySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  total : Number,
  time :  { type: Number, index: true } ,
  portfolio: Object
}, {
  timestamps: { createdAt: "created_at" }
});

const PortfolioHistory = mongoose.model("PortfolioHistory", portfolioHistorySchema);

module.exports = PortfolioHistory;
