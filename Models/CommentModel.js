const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
    },
    book: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "book",
    },
    comment: {
      type: String,
      require: [true, "empty text"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("comment", commentSchema);
