const errorResponse = require("../helpers/ErrorResponse");

const errorHandle = (err, req, res, next) => {
  console.log("Da bat loi: " + err);
  let error;
  error = new errorResponse(err.statusCode, err.message);

  if (err.name === "ValidationError") {
    //Nhập tên dưới 3 kí tự
    const message = Object.values(err.errors).map((messa) => messa.message);
    error = new errorResponse(400, message);
  }
  if (err.code === 11000) {
    // Bị trùng lặp
    const message = "information already exists";
    error = new errorResponse(400, message);
  }
  if (err.name === "CastError") {
    // Nhập địa chỉ lung tung
    const message = "not found link";
    error = new errorResponse(400, message);
  }
  if (err.name === "JsonWebTokenError") {
    const message = "jwt malformed";
    error = new errorResponse(401, message);
  }
  if (err.name === "TokenExpiredError") {
    const message = "jwt expired";
    error = new errorResponse(401, message);
  }
  res.status(error.statusCode).json({
    err: 1,
    success: false,
    data: error.message,
  });
};
module.exports = errorHandle;
