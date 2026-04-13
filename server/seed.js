const mongoose = require("mongoose");
const connectDB = require("./config/db");
const config = require("./config/env");
const User = require("./models/User");

const seedAdmin = async () => {
  const { adminEmail, adminPassword } = config;

  const existingUser = await User.findOne({ email: adminEmail }).select(
    "+password"
  );

  if (!existingUser) {
    await User.create({
      email: adminEmail,
      password: adminPassword,
      role: "admin",
    });
    console.log(`Admin user created: ${adminEmail}`);
    return;
  }

  const isSamePassword = await existingUser.comparePassword(adminPassword);

  if (!isSamePassword) {
    existingUser.password = adminPassword;
    await existingUser.save();
    console.log(`Admin password updated: ${adminEmail}`);
  } else {
    console.log(`Admin user already exists: ${adminEmail}`);
  }
};

// Standalone execution
if (require.main === module) {
  (async () => {
    try {
      await connectDB();
      await seedAdmin();
    } catch (error) {
      console.error("Seed failed:", error.message);
    } finally {
      await mongoose.disconnect();
      console.log("Database disconnected");
    }
  })();
}

module.exports = seedAdmin;
