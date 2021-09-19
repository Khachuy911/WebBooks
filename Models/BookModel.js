const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema(
  {
    name: {
      type: String,
      require: [true, "empty name"],
    },
    price: {
      type: String,
      require: [true, "empty price"],
    },
    description: {
      type: String,
      require: [true, "empty description"],
    },
    author: {
      type: String,
      require: [true, "empty author"],
    },
    image: {
      type: String,
      require: [true, "empty image"],
    },
    quantity: {
      type: Number,
      min: 1,
    },
    salePrice: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

//thiết lập chỉ mục văn bản cho search
// bookSchema.index(
//   {
//     name: "text",
//     description: "text",
//   },
//   {
//     weights: {
//       // độ ưu tiên, số càng cao độ ưu tiên càng lớn
//       name: 5,
//       description: 1,
//     },
//   }
// );
module.exports = mongoose.model("book", bookSchema);
