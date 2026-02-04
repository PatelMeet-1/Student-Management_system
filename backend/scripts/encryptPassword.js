const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/User");
// const User = require("../models/Admin");

const connectDB = require("../config/db");

const isBcryptHash = (str) => /^\$2[ayb]\$.{56}$/.test(str);

const encryptAllPasswords = async () => {
  try {
    await connectDB();

const users = await User.find().select("+password");
    console.log(`Found ${users.length} users`);

    let encryptedCount = 0;
    let skippedCount = 0;

    for (const user of users) {
      if (!user.password) {
        console.log(`Skipping ${user.email} - no password`);
        skippedCount++;
        continue;
      }

      if (isBcryptHash(user.password)) {
        console.log(`Already encrypted: ${user.email}`);
        continue;
      }

      user.password = await bcrypt.hash(user.password, 10);
      await user.save();
      console.log(`Encrypted: ${user.email}`);
      encryptedCount++;
    }

    console.log("\n====== SUMMARY ======");
    console.log("Encrypted:", encryptedCount);
    console.log("Skipped:", skippedCount);
    console.log("Total:", users.length);

    await mongoose.connection.close();
    console.log("✅ DB connection closed");
    process.exit(0);
  } catch (err) {
    console.error("Migration error:", err);
    await mongoose.connection.close();
    process.exit(1);
  }
};

encryptAllPasswords();
