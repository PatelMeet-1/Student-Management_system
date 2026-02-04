const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/User");
const connectDB = require("../config/db");

// Function to check if a string is already a bcrypt hash
const isBcryptHash = (str) => {
  // Bcrypt hashes start with $2a$, $2b$, $2y$, or $2x$ and are 60 characters long
  return /^\$2[ayb]\$.{56}$/.test(str);
};

// Function to encrypt all passwords
const encryptAllPasswords = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log("📦 Connected to database");

    // Find all users and include password
    const users = await User.find().select("+password");
    console.log(`\n📊 Found ${users.length} users in database\n`);

    let encryptedCount = 0;
    let alreadyEncryptedCount = 0;
    let errorCount = 0;

    // Process each user
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      
      try {
        // Check if password is already encrypted
        if (isBcryptHash(user.password)) {
          console.log(`✅ User ${i + 1}/${users.length}: ${user.email} - Password already encrypted`);
          alreadyEncryptedCount++;
        } else {
          // Encrypt the password
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(user.password, saltRounds);
          
          // Update user with hashed password
          user.password = hashedPassword;
          await user.save();
          
          console.log(`🔐 User ${i + 1}/${users.length}: ${user.email} - Password encrypted successfully`);
          encryptedCount++;
        }
      } catch (error) {
        console.error(`❌ User ${i + 1}/${users.length}: ${user.email} - Error: ${error.message}`);
        errorCount++;
      }
    }

    // Summary
    console.log("\n" + "=".repeat(50));
    console.log("📈 MIGRATION SUMMARY");
    console.log("=".repeat(50));
    console.log(`✅ Already encrypted: ${alreadyEncryptedCount}`);
    console.log(`🔐 Newly encrypted: ${encryptedCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`📊 Total processed: ${users.length}`);
    console.log("=".repeat(50) + "\n");

    // Close database connection
    await mongoose.connection.close();
    console.log("✅ Database connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration error:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Run the migration
encryptAllPasswords();

