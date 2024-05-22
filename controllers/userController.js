const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sequelize = require("../models").sequelize;
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const logger = require("../utils/logger"); // Adjust the path if necessary

/**
 * @swagger
 * /api/saveFullName:
 *   post:
 *     summary: Save user's full name
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Full name saved
 *       400:
 *         description: Full name already exists
 *       500:
 *         description: Internal server error
 */
exports.saveFullName = catchAsyncErrors(async (req, res) => {
  const { firstName, lastName } = req.body;

  try {
    const existingUser = await sequelize.query(
      "SELECT * FROM Users WHERE firstName = :firstName AND lastName = :lastName",
      {
        replacements: { firstName, lastName },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (existingUser.length > 0) {
      logger.warn(`Full name already exists: ${firstName} ${lastName}`);
      return res.status(400).json({ message: "Full name already exists" });
    }

    const newUser = await User.create({ firstName, lastName });
    req.session.userData = { id: newUser.id, firstName, lastName };
    logger.info(`New user created with ID: ${newUser.id}`);
    res.json({ message: "Firstname and Lastname saved", userId: newUser.id });
  } catch (error) {
    logger.error(`Error saving full name: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * @swagger
 * /api/saveEmail:
 *   post:
 *     summary: Save user's email
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email saved
 *       400:
 *         description: Email already exists or User ID not found in session
 *       500:
 *         description: Internal server error
 */
exports.saveEmail = catchAsyncErrors(async (req, res) => {
  const { email } = req.body;

  try {
    const results = await sequelize.query(
      "SELECT * FROM Users WHERE email = :email",
      {
        replacements: { email },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (results.length > 0) {
      logger.warn(`Email already exists: ${email}`);
      return res.status(400).json({ message: "Email already exists" });
    }

    req.session.userData.email = email;

    if (!req.session.userData.id) {
      logger.warn("User ID not found in session");
      return res.status(400).json({ message: "User ID not found in session" });
    }

    await User.update({ email }, { where: { id: req.session.userData.id } });

    logger.info(`Email updated for user ID: ${req.session.userData.id}`);
    res.json({ message: "Email saved" });
  } catch (error) {
    logger.error(`Error saving email: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * @swagger
 * /api/savePhone:
 *   post:
 *     summary: Save user's phone number
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Phone number saved
 *       400:
 *         description: Phone number already exists or User ID not found in session
 *       500:
 *         description: Internal server error
 */
exports.savePhone = catchAsyncErrors(async (req, res) => {
  const { phone } = req.body;

  try {
    const existingPhone = await sequelize.query(
      "SELECT * FROM Users WHERE phone = :phone",
      {
        replacements: { phone },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (existingPhone.length > 0) {
      logger.warn(`Phone number already exists: ${phone}`);
      return res.status(400).json({ message: "Phone number already exists" });
    }

    req.session.userData.phone = phone;

    if (!req.session.userData.id) {
      logger.warn("User ID not found in session");
      return res.status(400).json({ message: "User ID not found in session" });
    }

    await sequelize.query("UPDATE Users SET phone = :phone WHERE id = :id", {
      replacements: { phone, id: req.session.userData.id },
      type: sequelize.QueryTypes.UPDATE,
    });

    logger.info(`Phone number updated for user ID: ${req.session.userData.id}`);
    res.json({ message: "Phone number saved" });
  } catch (error) {
    logger.error(`Error saving phone number: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * @swagger
 * /api/savePassword:
 *   post:
 *     summary: Save user's password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password saved and token created
 *       400:
 *         description: User ID not found in session
 *       500:
 *         description: Internal server error
 */
exports.savePassword = catchAsyncErrors(async (req, res) => {
  const { password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    req.session.userData.password = hashedPassword;

    if (!req.session.userData.id) {
      logger.warn("User ID not found in session");
      return res.status(400).json({ message: "User ID not found in session" });
    }

    await sequelize.query(
      "UPDATE Users SET password = :password WHERE id = :id",
      {
        replacements: { password: hashedPassword, id: req.session.userData.id },
        type: sequelize.QueryTypes.UPDATE,
      }
    );

    const newUser = await User.findOne({
      where: { id: req.session.userData.id },
    });
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    req.session.destroy((err) => {
      if (err) {
        logger.error(`Error destroying session: ${err.message}`);
        return res.status(500).json({ message: "Internal Server Error" });
      }
      res.clearCookie("connect.sid"); // Adjust the cookie name if different
      logger.info(
        `Password updated and token created for user ID: ${newUser.id}`
      );
      res.json({ message: "Password saved", token });
    });
  } catch (error) {
    logger.error(`Error saving password: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
