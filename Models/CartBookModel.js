const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartBookSchema = new Schema({
  cart: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "cart",
  },
  book: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "book",
  },
  quantity: {
    type: Number,
    require: [true, "empty quantity"],
    min: 1,
  },
},{
  timestamps:true,
});
module.exports = mongoose.model("cartBook", cartBookSchema);
