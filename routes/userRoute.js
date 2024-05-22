const express = require("express");
const router = express.Router();
const {
  saveFullName,
  saveEmail,
  savePhone,
  savePassword,
} = require("../controllers/userController");
const sessionMiddleware = require("../middlewares/sessionMiddleware");

router.post("/savefullname", sessionMiddleware, saveFullName);
router.post("/saveEmail", sessionMiddleware, saveEmail);
router.post("/savePhone", sessionMiddleware, savePhone);
router.post("/savePassword", sessionMiddleware, savePassword);

module.exports = router;
