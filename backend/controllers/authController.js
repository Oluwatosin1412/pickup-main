const User = require("../models/userModel");
const Organization = require("../models/orgModel");
const TokenModel = require("../models/tokenModel"); // Assuming you have a TokenModel for storing tokens
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../helpers/mailer"); // Updated path to the sendEmail utility

const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

const register = async (req, res) => {
  const { email, username, password, passwordConfirm, phoneNumber, address, firstName, lastName } = req.body;

  if (password !== passwordConfirm) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, username, password: hashedPassword, phoneNumber, address, firstName, lastName });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const registerOrganization = async (req, res) => {
  const { businessName, location, size, yearsOfOperation, email, password, passwordConfirm, profileImage } = req.body;

  if (password !== passwordConfirm) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const organization = new Organization({ businessName, location, size, yearsOfOperation, email, password: hashedPassword, profileImage });
    await organization.save();
    res.status(201).json({ message: "Organization registered successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    res.json({ accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const loginOrganization = async (req, res) => {
  const { email, password } = req.body;

  try {
    const organization = await Organization.findOne({ email });
    if (!organization) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, organization.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const accessToken = generateAccessToken(organization);
    const refreshToken = generateRefreshToken(organization);
    res.json({ accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const refreshToken = (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ message: "Token is required" });

  try {
    const user = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const accessToken = generateAccessToken(user);
    res.json({ accessToken });
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Generate a reset token and send it via email
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_RESET_SECRET, { expiresIn: "1h" });
    // Send resetToken via email 
    res.json({ message: "Password reset token sent" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword, newPasswordConfirm } = req.body;

  if (newPassword !== newPasswordConfirm) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(400).json({ message: "User not found" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    let token = await TokenModel.findOne({ userId: user._id });
    if (token) await token.deleteOne();

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(resetToken, 10);

    const newToken = await new TokenModel({
      userId: user._id,
      token: hash,
      createdAt: Date.now(),
    }).save();

    const clientURL = process.env.CLIENT_URL;
    const link = `${clientURL}/resetpassword/${user._id}/${resetToken}/${newToken._id}`;

    await sendEmail(
      process.env.EMAIL_USER,
      user.email,
      "Password Reset Request",
      "You requested to reset your password",
      `<p>Please click the link below to reset your password:</p><a href="${link}">Reset Password</a>`
    );

    res.status(200).json({ message: "Password reset link successfully sent!" });
  } catch (err) {
    res.status(400).json({ message: "Error requesting password reset" });
  }
};

const requestPasswordResetOrg = async (req, res) => {
  try {
    const { email } = req.body;

    const organization = await Organization.findOne({ email });
    if (!organization) return res.status(400).json({ message: "Organization not found" });

    let token = await TokenModel.findOne({ userId: organization._id });
    if (token) await token.deleteOne();

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(resetToken, 10);

    const newToken = await new TokenModel({
      userId: organization._id,
      token: hash,
      createdAt: Date.now(),
    }).save();

    const clientURL = process.env.CLIENT_URL;
    const link = `${clientURL}/org/resetpassword/${organization._id}/${resetToken}/${newToken._id}`;

    await sendEmail(
      process.env.EMAIL_USER,
      organization.email,
      "Password Reset Request",
      "You requested to reset your password",
      `<p>Please click the link below to reset your password:</p><a href="${link}">Reset Password</a>`
    );

    res.status(200).json({ message: "Password reset link successfully sent!" });
  } catch (err) {
    res.status(400).json({ message: "Error requesting password reset" });
  }
};

const resetPasswordOrg = async (req, res) => {
  try {
    const { userID, token, tokenID } = req.params;
    const { password } = req.body;

    const passwordResetToken = await TokenModel.findOne({ _id: tokenID });
    if (!passwordResetToken) return res.status(400).json({ message: "Invalid or expired password reset token" });

    const isValid = await bcrypt.compare(token, passwordResetToken.token);
    if (!isValid) return res.status(400).json({ message: "Invalid or expired password reset token" });

    const hash = await bcrypt.hash(password, 12);
    await Organization.updateOne({ _id: userID }, { $set: { password: hash } }, { new: true });

    const organization = await Organization.findById({ _id: userID });

    await sendEmail(
      process.env.EMAIL_USER,
      organization.email,
      "Your password has changed!",
      "Password request successful",
      `<p>You have successfully reset your password</p><p>If you did not request a password reset, please contact support</p>`
    );

    await passwordResetToken.deleteOne();
    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(400).json({ message: "Error changing your password" });
  }
};

module.exports = { register, registerOrganization, login, loginOrganization, refreshToken, forgotPassword, resetPassword, requestPasswordReset, requestPasswordResetOrg, resetPasswordOrg };