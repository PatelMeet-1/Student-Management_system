
const Faculty = require("../models/Faculty");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// ================= EMAIL CONFIG =================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();


// Bulk create faculties
exports.createFacultiesBulk = async (req, res) => {
  try {
    const faculties = req.body; // expect an array of objects

    if (!Array.isArray(faculties) || faculties.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Array of faculties required",
      });
    }

    // Prepare array with hashed passwords
    const facultyDocs = await Promise.all(
      faculties.map(async (f) => {
        const { name, contact, email, course, password } = f;

        if (!name || !contact || !email || !password) {
          throw new Error("All fields required for each faculty");
        }

        const exists = await Faculty.findOne({ email: email.toLowerCase() });
        if (exists) {
          throw new Error(`Email already exists: ${email}`);
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        return {
          name: name.trim(),
          contact: contact.trim(),
          email: email.toLowerCase().trim(),
          course: course || null,
          password: hashedPassword,
        };
      })
    );

    const created = await Faculty.insertMany(facultyDocs);

    res.status(201).json({
      success: true,
      message: `${created.length} faculties created successfully`,
      data: created,
    });
  } catch (err) {
    console.error("BULK CREATE ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// =================================================
// =================== LOGIN =======================
// =================================================
exports.loginFaculty = async (req, res) => {
  try {
    const { email, password } = req.body;

    const cleanEmail = email?.toLowerCase().trim();
    const cleanPassword = password?.trim();

    if (!cleanEmail || !cleanPassword) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    const faculty = await Faculty
      .findOne({ email: cleanEmail })
      .select("+password");

    if (!faculty) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(cleanPassword, faculty.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: faculty._id },
      process.env.JWT_SECRET || "facultySecretKey123",
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      faculty: {
        id: faculty._id,
        name: faculty.name,
        email: faculty.email,
        contact: faculty.contact,
        course: faculty.course,
        department: faculty.department,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// =================================================
// ================= SEND OTP ======================
// =================================================
exports.sendResetOTPEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const cleanEmail = email?.toLowerCase().trim();

    if (!cleanEmail) {
      return res.status(400).json({
        success: false,
        message: "Email required",
      });
    }

    const faculty = await Faculty.findOne({ email: cleanEmail });
    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty not found",
      });
    }

    const otp = generateOTP();
    faculty.otp = otp;
    faculty.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 min
    await faculty.save();

  await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: cleanEmail,
  subject: "Faculty Password Reset - Your OTP Code",
  html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Faculty Password Reset</title>
</head>

<body style="margin:0;padding:20px;background:#f4f4f4;font-family:Arial, sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center">

<table width="500" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden">

<!-- HEADER -->
<tr>
<td style="background:#333;color:white;padding:20px;text-align:center">
<h2 style="margin:0">🔐 Faculty Password Reset</h2>
</td>
</tr>

<!-- CONTENT -->
<tr>
<td style="padding:30px;text-align:center">

<p style="font-size:16px;color:#333;margin-bottom:20px">
Use the OTP below to reset your password.
</p>

<!-- OTP BOX -->
<div style="
font-size:32px;
font-weight:bold;
letter-spacing:6px;
background:#eeeeee;
padding:15px 25px;
display:inline-block;
border-radius:6px;
margin-bottom:20px;
">
${otp}
</div>

<p style="font-size:14px;color:#555">
This OTP is valid for <b>10 minutes only</b>.
</p>

</td>
</tr>

<!-- SUPPORT TEAM -->
<tr>
<td style="background:#333;color:white;text-align:center;padding:20px;font-size:14px">

<b>Support Team</b><br><br>

Name: Meet Patel <br>
Email: patelmeetbhai6333@gmail.com <br>
Contact: +91 9328407114

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`
});


    res.json({
      success: true,
      message: "OTP sent to your email",
    });
  } catch (err) {
    console.error("OTP ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
};


// ============== RESET PASSWORD ===================

exports.verifyOTPAndResetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const cleanEmail = email?.toLowerCase().trim();

    if (!cleanEmail || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP and new password required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const faculty = await Faculty.findOne({
      email: cleanEmail,
      otp: otp,
      otpExpiry: { $gt: Date.now() },
    });

    if (!faculty) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    faculty.password = await bcrypt.hash(newPassword, 12);
    faculty.otp = null;
    faculty.otpExpiry = null;

    await faculty.save();

    res.json({
      success: true,
      message: "Password reset successful. Please login.",
    });
  } catch (err) {
    console.error("RESET ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


// ================= CREATE ========================

exports.createFaculty = async (req, res) => {
  try {
const { name, contact, email, course, department, password } = req.body;
    const cleanEmail = email?.toLowerCase().trim();

    if (!name || !contact || !cleanEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    const exists = await Faculty.findOne({ email: cleanEmail });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

   const faculty = await Faculty.create({
  name: name.trim(),
  contact: contact.trim(),
  email: cleanEmail,
  course,
  department,
  password: hashedPassword,
});

    res.status(201).json({
      success: true,
      message: "Faculty created successfully",
      faculty,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// ================= READ ==========================

exports.getFaculties = async (req, res) => {
  try {
    const faculties = await Faculty.find()
      .populate('course', 'courseName departments')
      .lean();

    const facultiesWithDept = faculties.map(faculty => {
      let departmentName = "N/A";
      
      if (faculty.course && faculty.course.departments) {
        const dept = faculty.course.departments.find(d => 
          d._id.toString() === faculty.department?.toString()
        );
        departmentName = dept ? dept.departmentName : "N/A";
      }

      return {
        ...faculty,
        department: {
          _id: faculty.department,
          departmentName: departmentName
        }
      };
    });

    res.json({
      success: true,
      data: facultiesWithDept,
    });
  } catch (err) {
    console.error("GET FACULTIES ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};



// ================= UPDATE ========================

exports.updateFaculty = async (req, res) => {
  try {
    const { id } = req.params;
const { name, contact, email, course, department, password } = req.body;
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (contact) updateData.contact = contact.trim();
    if (course) updateData.course = course;
    if (department) updateData.department = department; // ✅ ADD THIS

    if (email) updateData.email = email.toLowerCase().trim();
    if (password) updateData.password = await bcrypt.hash(password, 12);

    const updated = await Faculty.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate("course", "courseName");

    res.json({
      success: true,
      message: "Faculty updated successfully",
      faculty: updated,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// ================= DELETE ========================

exports.deleteFaculty = async (req, res) => {
  try {
    await Faculty.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: "Faculty deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
