const User = require("../models/User");
const Doctor = require("../models/Doctor");

const sendToken = (user, statusCode, res) => {
  const token = user.getJwtToken();
  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "lax",
  };
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone,
    },
  });
};

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone, gender, specialization, experience, consultationFee, qualification, hospital } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const user = await User.create({ name, email, password, role: role || "patient", phone, gender });

    if (role === "doctor") {
      await Doctor.create({
        user: user._id,
        specialization: specialization || "General",
        experience: experience || 0,
        consultationFee: consultationFee || 500,
        qualification: qualification ? [qualification] : [],
        hospital: hospital || "",
        isApproved: true,  // Auto-approve for now
      });
    }

    sendToken(user, 201, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please enter email and password" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    sendToken(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Logout
exports.logout = (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()), httpOnly: true });
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

// Get current user
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    let doctorProfile = null;
    if (user.role === "doctor") {
      doctorProfile = await Doctor.findOne({ user: user._id });
    }
    res.status(200).json({ success: true, user, doctorProfile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, gender, dob, address } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, gender, dob, address },
      { new: true, runValidators: true }
    );
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select("+password");
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Old password is incorrect" });
    }
    user.password = newPassword;
    await user.save();
    sendToken(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
