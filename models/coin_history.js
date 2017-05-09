const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const coinHistorySchema = new Schema({
  id: { type: String, index: true },   //from coinmarketcap
  price_usd : Number,
  price_btc : Number,
  symbol: String,
  time : { type: Number, index: true } ,
}, {
  timestamps: { createdAt: "created_at" }
});

const CoinHistory = mongoose.model("CoinHistory", coinHistorySchema);

module.exports = CoinHistory;
