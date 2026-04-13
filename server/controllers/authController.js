const User = require("../models/User");
const { generateToken } = require("../utils/helpers");

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const token = generateToken({ id: user._id, role: user.role });

    res.json({
      success: true,
      token,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

const getMe = (req, res) => {
  res.json({
    success: true,
    user: { id: req.user._id, email: req.user.email, role: req.user.role },
  });
};

module.exports = { login, getMe };
