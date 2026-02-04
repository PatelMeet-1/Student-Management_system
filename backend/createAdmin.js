const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Admin = require("./models/Admin");

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));

async function createAdmin() {
  try {
    const existing = await Admin.findOne({ username: "admin" });
    if (existing) {
      console.log("Admin already exists");
      process.exit();
    }

    const admin = new Admin({
      username: "admin",
      password: "admin123" // 🔥 PLAIN PASSWORD
    });

    await admin.save(); // 🔐 pre-save hook encrypt karega
    console.log("✅ Admin created successfully!");
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

createAdmin();
