const router = require("express").Router();
const { createOtpSession, OTP_TTL_MS, verifyOtpSession } = require("../data/otpStore");
const {
  loginUser,
  updateUser,
  getUserById,
  getBookings,
  getOverview,
  getUserSettings,
  updateUserSettings,
  changeUserPassword,
  deleteUserAccount,
} = require("../data/repository");

router.post("/request-otp", async (req, res) => {
  const { phone } = req.body || {};

  if (!String(phone || "").trim()) {
    return res.status(400).json({ message: "Phone number is required." });
  }

  try {
    const session = createOtpSession(phone);
    console.log(`PawAssist OTP for ${session.phone}: ${session.code}`);

    return res.json({
      success: true,
      phone: session.phone,
      otp: session.code,
      expiresInMs: OTP_TTL_MS,
      message: "OTP generated for this phone number.",
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to generate OTP.", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { phone, name, city, petName } = req.body || {};

  if (!phone) {
    return res.status(400).json({ message: "Phone number is required." });
  }

  try {
    const user = await loginUser({ phone, name, city, petName });

    return res.json({
      user,
      overview: await getOverview(user.id),
      bookings: await getBookings(user.id),
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to log in user.", error: error.message });
  }
});

router.post("/login-with-otp", async (req, res) => {
  const { phone, otp } = req.body || {};

  if (!String(phone || "").trim()) {
    return res.status(400).json({ message: "Phone number is required." });
  }

  if (!String(otp || "").trim()) {
    return res.status(400).json({ message: "OTP is required." });
  }

  const verification = verifyOtpSession(phone, otp);

  if (!verification.ok) {
    const messageByReason = {
      missing: "Request a new OTP before trying to log in.",
      expired: "OTP expired. Request a new one.",
      invalid: "Incorrect OTP. Please try again.",
    };

    return res.status(400).json({
      message: messageByReason[verification.reason] || "Unable to verify OTP.",
    });
  }

  try {
    const user = await loginUser({ phone });

    return res.json({
      user,
      overview: await getOverview(user.id),
      bookings: await getBookings(user.id),
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to log in user.", error: error.message });
  }
});

router.get("/profile/:userId", async (req, res) => {
  try {
    const user = await getUserById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch user profile.", error: error.message });
  }
});

router.put("/profile/:userId", async (req, res) => {
  try {
    const user = await updateUser(req.params.userId, req.body || {});

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.json({
      user,
      overview: await getOverview(user.id),
      bookings: await getBookings(user.id),
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to update user profile.", error: error.message });
  }
});

router.get("/settings/:userId", async (req, res) => {
  try {
    const settings = await getUserSettings(req.params.userId);

    if (!settings) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.json(settings);
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch user settings.", error: error.message });
  }
});

router.put("/settings/:userId", async (req, res) => {
  try {
    const settings = await updateUserSettings(req.params.userId, req.body || {});

    if (!settings) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.json(settings);
  } catch (error) {
    return res.status(500).json({ message: "Unable to update user settings.", error: error.message });
  }
});

router.put("/password/:userId", async (req, res) => {
  const { currentPassword, nextPassword } = req.body || {};

  if (!currentPassword || !nextPassword) {
    return res.status(400).json({ message: "Current and next password are required." });
  }

  if (String(nextPassword).length < 6) {
    return res.status(400).json({ message: "New password must be at least 6 characters." });
  }

  try {
    const result = await changeUserPassword(req.params.userId, currentPassword, nextPassword);

    if (!result.ok) {
      if (result.reason === "not_found") {
        return res.status(404).json({ message: "User not found." });
      }

      return res.status(400).json({ message: "Current password is incorrect." });
    }

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ message: "Unable to change password.", error: error.message });
  }
});

router.delete("/account/:userId", async (req, res) => {
  try {
    const removed = await deleteUserAccount(req.params.userId);

    if (!removed) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ message: "Unable to delete account.", error: error.message });
  }
});

module.exports = router;
