const express = require("express");
const {
  releaseMoney,
  suspendAndReallocate,
  withdrawMoney,
} = require("../Controllers/release");
const router = express.Router();

router.route("/releasemoney/:id").post(releaseMoney);

router.route("/suspendreallocate").post(suspendAndReallocate);

router.route("/withdraw").post(withdrawMoney);

module.exports = router;
