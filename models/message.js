const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const messageSchema = new Schema({
 senderId: String,
 recipientIds: [String],
 text: String,
 private: Boolean
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});
messageSchema.index({ location: '2dsphere' });

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
