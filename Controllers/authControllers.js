const users = require("../Models/UsersModel");
const asyncHandle = require("../Middleware/asyncHandle");
const errorResponse = require("../helpers/ErrorResponse");
const jwt = require("jsonwebtoken");
const clientRedis = require("../Config/redis");
const { promisify } = require("util");
const sendEmail = require("../Middleware/mailer");
const crypto = require("crypto");
const { EMSGSIZE } = require("constants");
module.exports = {
  signup: asyncHandle(async (req, res) => {
    const data = req.body;
    const user = await users.create(data);
    const token = user.signToken();
    const refreshToken = user.signRefreshToken();
    res.status(200).json({
      status: "sucess",
      token,
      refreshToken,
    });
  }),
  login: asyncHandle(async (req, res, next) => {
    const data = req.body;
    if (!data)
      return next(new errorResponse(401, "email or password not exists"));
    const user = await users.findOne({ email: data.email }).select("+password");
    if (!user || !(await user.matchPassword(data.password, user.password)))
      return next(new errorResponse(401, "user or password wrong"));
    const token = user.signToken();
    const refreshToken = user.signRefreshToken();
    res.status(200).json({
      status: "sucess",
      token,
      refreshToken,
    });
  }),
  logout: asyncHandle(async (req, res, next) => {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken)
      return next(new (errorResponse(401, "refresh token invalid !"))());
    const userId = await jwt.verify(refreshToken, process.env.JWT_SECRET);
    clientRedis.DEL(userId.id, (err) => {
      if (err) console.log(401, "logout fail");
    });
    res.status(200).json({
      status: "success",
      data: "logout successfully",
    });
  }),
  protect: asyncHandle(async (req, res, next) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    )
      token = req.headers.authorization.split(" ")[1];
    if (!token) return next(new errorResponse(401, "you are not login"));
    const encoded = await jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await users.findById(encoded.id);
    if (!currentUser) return next(new errorResponse(401, "user invalid"));
    req.user = currentUser;
    next();
  }),
  getMe: asyncHandle(async (req, res) => {
    const id = req.user.id;
    const user = await users.findById(id);
    if (!user) return next(new errorResponse(401, "user get me invalid"));
    res.status(200).json({
      status: "sucess",
      data: user,
    });
  }),
  restrictTo: (...role) => {
    return (req, res, next) => {
      if (!role.includes(req.user.role))
        return next(new errorResponse(403, "deny mission"));
      next();
    };
  },

  accessTokenRefresh: asyncHandle(async (req, res, next) => {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken)
      return next(new errorResponse(403, "refresh token invalid"));
    const encoded = await jwt.verify(refreshToken, process.env.JWT_SECRET);
    const refreshTokenRedis = await promisify(clientRedis.get).bind(
      clientRedis
    )(encoded.id);
    if (refreshToken !== refreshTokenRedis)
      return next(new errorResponse(401, "refreshToken invalid"));
    const user = await users.findById(encoded.id);
    if (!user) return next(new errorResponse(401, "user invalid"));
    const token = user.signToken();
    res.status(200).json({
      status: "sucess",
      token,
    });
  }),
  forgotPassword: asyncHandle(async (req, res, next) => {
    const email = req.body.email;
    if (!email) return next(new errorResponse(401, "email are not exists !"));
    const user = await users.findOne({ email });
    if (!user)
      return next(new (errorResponse(401, "user are not exitst ! "))());
    const resetPw = await user.signResetPwToken();
    await user.save({ validateBeforeSave: false });
    const message = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/user/resetPassword/${resetPw}`;
    res.status(200).json({
      status: "success",
      data: `check your email: ${email}`,
      urlReset: message,
      resetToken: resetPw,
    });
    // try {
    //   await sendEmail({
    //     email,
    //     message,
    //   });
    //   res.status(200).json({
    //     status: "success",
    //     data: `check your email: ${email}`,
    //   });
    // } catch (error) {
    //   res.status(200).json({
    //     status: "fail",
    //     data: "send email fail",
    //   });
    // }
  }),
  resetPassword: asyncHandle(async (req, res, next) => {
    const resetHash = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
    const user = await users.findOne({ resetPwToken: resetHash });
    if (!user) return next(new errorResponse(401, "token invalid or expires"));
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.resetPwToken = undefined;
    user.resetPwTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });
    const token = user.signToken();
    res.status(200).json({
      status: "success",
      massage: `reset password successfully`,
      token,
    });
  }),
};
