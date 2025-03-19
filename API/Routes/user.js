const express = require("express");
const {
  getUser,
  getUsers,
  updateUser,
  deleteUser,
  getLoggedInUser,
} = require("../Controllers/user");
const router = express.Router();

router.route("/me").get(getLoggedInUser);

router.route("/").get(getUsers);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
