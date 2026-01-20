const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const resetPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const User = require("../src/models/User");

    const newPassword = "Admin@123"; // Change this to your desired password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const result = await User.updateOne(
      { email: "sharmsandes121@gmail.com" },
      {
        $set: {
          password: hashedPassword,
          loginAttempts: 0,
        },
        $unset: { lockUntil: "" },
      },
    );

    console.log("✅ Password reset successful!");
    console.log("📧 Email: sharmsandes121@gmail.com");
    console.log("🔑 New Password:", newPassword);
    console.log("Result:", result);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

resetPassword();
