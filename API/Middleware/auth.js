const asyncHandler = require("../Middleware/async");
const ErrorResponse = require("../Utils/errorResponse");
const User = require("../Models/User");

exports.protect = asyncHandler(async (req, res, next) => {
  const clerkUser = req.auth.userId; // Get Clerk user ID

  if (!clerkUser) {
    return next(new ErrorResponse("Not authorized", 401));
  }

  const user = await User.findOne({ clerkId: clerkUser });

  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  req.user = user; // Attach user data
  next();
});

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorResponse("Not authorized", 403));
    }
    next();
  };
};
