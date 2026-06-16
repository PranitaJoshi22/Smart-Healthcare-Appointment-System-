/**
 * Remove all doctors except Pranav Joshi
 * Run: node removeDocters.js
 */
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ MongoDB connected");

  const User = require("./models/User");
  const Doctor = require("./models/Doctor");

  // Find Pranav Joshi's user account
  const pranav = await User.findOne({ name: /pranav joshi/i, role: "doctor" });

  if (!pranav) {
    console.log("❌ Pranav Joshi not found. Listing all doctors:");
    const allDocs = await User.find({ role: "doctor" }).select("name email");
    allDocs.forEach(d => console.log(`  - ${d.name} (${d.email})`));
    await mongoose.disconnect();
    process.exit(0);
  }

  console.log(`✅ Found Pranav Joshi: ${pranav.email}`);

  // Find all other doctors
  const otherDoctors = await User.find({ role: "doctor", _id: { $ne: pranav._id } }).select("_id name email");

  console.log(`\n🗑️  Removing ${otherDoctors.length} other doctor(s):`);
  otherDoctors.forEach(d => console.log(`  - ${d.name} (${d.email})`));

  // Delete their Doctor profiles
  const otherIds = otherDoctors.map(d => d._id);
  await Doctor.deleteMany({ user: { $in: otherIds } });

  // Delete their User accounts
  await User.deleteMany({ _id: { $in: otherIds } });

  console.log("\n✅ Done! Only Pranav Joshi remains as doctor.");

  await mongoose.disconnect();
  process.exit(0);
};

run().catch(err => {
  console.error("Error:", err.message);
  process.exit(1);
});
