const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
      unique: [true, "it not the same"],
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("cart", cartSchema);
