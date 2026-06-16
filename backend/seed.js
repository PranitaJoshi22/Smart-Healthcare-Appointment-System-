/**
 * Seed Script — Creates only Admin and Patient demo accounts
 * Your registered doctors are preserved
 * Run: node seed.js
 */
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

const seedData = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ MongoDB connected");

  const User = require("./models/User");

  const hashedPass = await bcrypt.hash("demo123", 12);

  // Only remove admin and patient demo accounts — doctors are untouched
  await User.deleteMany({ email: { $in: ["admin@demo.com", "patient@demo.com"] } });

  // Admin
  await User.create({
    name: "Admin",
    email: "admin@demo.com",
    password: hashedPass,
    role: "admin",
    phone: "+91 99999 00001",
    gender: "male",
    isVerified: true,
  });
  console.log("✅ Admin created: admin@demo.com / demo123");

  // Patient
  await User.create({
    name: "Rahul Sharma",
    email: "patient@demo.com",
    password: hashedPass,
    role: "patient",
    phone: "+91 98765 43210",
    gender: "male",
    address: { city: "Mumbai", state: "Maharashtra" },
    isVerified: true,
  });
  console.log("✅ Patient created: patient@demo.com / demo123");

  console.log("\n🎉 Seed completed!");
  console.log("\n📋 Demo Accounts:");
  console.log("   Admin:   admin@demo.com   / demo123");
  console.log("   Patient: patient@demo.com / demo123");
  console.log("\n   Your registered doctors are preserved ✅\n");

  await mongoose.disconnect();
  process.exit(0);
};

seedData().catch((err) => {
  console.error("Seed error:", err.message);
  process.exit(1);
});
