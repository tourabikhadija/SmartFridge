const User = require("../models/User");
const Notification = require("../models/Notification");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Welcome notification
    await Notification.create({
      user: user._id,
      message:
        "Bienvenue dans SmartFridge ! Ajoutez vos premiers produits pour recevoir des alertes avant leur expiration.",
      type: "welcome",
      isRead: false,
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }
    
    if (!user.isActive) {
      return res.status(403).json({
      message: "Account is deactivated",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Change email → current password required
    if (email && email !== user.email) {
      if (!password) {
        return res.status(400).json({
          message: "Password is required to change email",
        });
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        user.password
      );

      if (!isPasswordValid) {
        return res.status(401).json({
          message: "Incorrect password",
        });
      }

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({
          message: "Email already exists",
        });
      }

      user.email = email;
    }

    // Change name
    if (name) {
      user.name = name;
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const logout = async (req, res) => {
  try {
    res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  logout,
  updateProfile,
};