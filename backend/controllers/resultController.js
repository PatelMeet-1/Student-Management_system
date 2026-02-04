const Result = require("../models/Result");

/* ================= GET ALL RESULTS (Admin/Faculty) ================= */
const getResults = async (req, res) => {
  try {
    const { type, published } = req.query;
    const query = {};

    if (type) query.type = type;
    if (published !== undefined) query.published = published === 'true';

    const results = await Result.find(query)
      .populate("studentId", "name EnrollmentNo course department")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: results,
      count: results.length
    });
  } catch (err) {
    console.error("❌ Get results error:", err);
    res.status(500).json({ message: "Failed to get results" });
  }
};

/* ================= GET PUBLISHED RESULTS (Student Only) ================= */
const getPublishedResults = async (req, res) => {
  try {
    const results = await Result.find({ published: true })
      .populate("studentId", "name EnrollmentNo course department")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: results,
      count: results.length
    });
  } catch (err) {
    console.error("❌ Get published results error:", err);
    res.status(500).json({ message: "Failed to get published results" });
  }
};

/* ================= GET STUDENT RESULTS ================= */
const getStudentResults = async (req, res) => {
  try {
    const results = await Result.find({ 
      studentId: req.params.studentId,
      published: true  // Students sirf published dekhein
    })
      .populate("studentId", "name EnrollmentNo course department")
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      data: results
    });
  } catch (err) {
    console.error("❌ Get student results error:", err);
    res.status(500).json({ message: "Failed to get student results" });
  }
};

/* ================= GET RESULT BY ID ================= */
const getResultById = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate("studentId", "name EnrollmentNo course department");

    if (!result) return res.status(404).json({ message: "Result not found" });
    
    res.json({
      success: true,
      data: result
    });
  } catch (err) {
    console.error("❌ Get result by ID error:", err);
    res.status(500).json({ message: "Failed to get result" });
  }
};

/* ================= ADD / UPDATE RESULT - DRAFT BY DEFAULT ✅ ================= */
const addOrUpdateResult = async (req, res) => {
  try {
    console.log("📥 Backend received:", req.body);
    
    const { studentId, course, department, Sem, semester, type, subjects } = req.body;
    const semName = Sem || semester;
    
    if (!studentId || !semName || !subjects?.length) {
      return res.status(400).json({ 
        message: "Student, semester or subjects missing",
        received: req.body 
      });
    }

    // 🔥 REMEDIAL TYPE DETECTION
    let resultType = type;
    let isRemedial = false;
    
    if (type?.toLowerCase().includes('remedial') || 
        type?.toLowerCase().includes('r1') || 
        type?.toLowerCase().includes('r2')) {
      resultType = 'remedial';
      isRemedial = true;
    }

    const processedSubjects = subjects.map(s => ({
      name: s.name?.trim(),
      marks: Number(s.marks) || 0,
      maxMarks: Number(s.maxMarks) || 70,
      type: resultType  // Subject type set
    })).filter(s => s.name);

    let result = await Result.findOne({ 
      studentId, 
      Sem: semName,
      type: resultType
    });

    if (result) {
      result.subjects = processedSubjects;
      result.course = course;
      result.department = department;
      result.Sem = semName;
      result.isRemedial = isRemedial;
      result.published = false;  // Always DRAFT on update
    } else {
      result = new Result({
        studentId,
        course: course || "Unknown",
        department: department || "Unknown", 
        Sem: semName,
        type: resultType,
        isRemedial,
        subjects: processedSubjects,
        published: false  // ✅ NEW: Always DRAFT
      });
    }

    await result.save();
    await result.populate("studentId", "name EnrollmentNo course department");
    
    console.log(`✅ ${isRemedial ? 'REMEDIAL' : 'REGULAR'} result saved (DRAFT):`, result._id);
    res.status(201).json(result);
  } catch (err) {
    console.error("❌ AddOrUpdateResult error:", err);
    res.status(500).json({ message: "Save failed", error: err.message });
  }
};

/* ================= 🔥 SUPER SMART REMEDIAL - 1/2/3 FAIL MAGIC ================= */
const smartRemedial = async (req, res) => {
  try {
    console.log("🔥 SUPER SMART REMEDIAL called:", req.body);
    
    const { studentId, Sem, course, department, newSubjects } = req.body;
    
    if (!studentId || !Sem || !newSubjects?.length) {
      return res.status(400).json({ message: "studentId, Sem, newSubjects required" });
    }

    // 1️⃣ Find ALL previous results (internal + uni + practical)
    const prevResults = await Result.find({ 
      studentId, 
      Sem,
      type: { $in: ['internal', 'university', 'practical'] }  // Regular only
    }).sort({ createdAt: -1 });

    if (!prevResults.length) {
      return res.status(404).json({ message: "Previous regular results not found" });
    }

    // 2️⃣ SMART SUBJECT MERGING (PASS subjects PROTECTED!)
    const subjectMap = new Map();
    
    // Previous subjects load (PASS + FAIL dono safe)
    prevResults.forEach(result => {
      result.subjects.forEach(subject => {
        const key = `${subject.name.toLowerCase()}-${subject.type}`;
        // ❌ FAIL subjects bhi safe - purane rahenge unless new remedial
        if (!subjectMap.has(key)) {
          subjectMap.set(key, {
            name: subject.name,
            marks: subject.marks,
            maxMarks: subject.maxMarks,
            type: result.type,
            isPass: (subject.marks / subject.maxMarks) >= 0.33
          });
        }
      });
    });

    // 3️⃣ NEW remedial subjects OVERRIDE
    const processedNewSubjects = newSubjects.map(s => ({
      name: s.name?.trim(),
      marks: Number(s.marks) || 0,
      maxMarks: Number(s.maxMarks) || 70,
      type: s.type || 'university',
      isPass: true  // Remedial = assume pass
    }));

    processedNewSubjects.forEach(s => {
      const key = `${s.name.toLowerCase()}-${s.type}`;
      subjectMap.set(key, s);
    });

    // 4️⃣ FINAL subjects array
    const finalSubjects = Array.from(subjectMap.values());

    // 5️⃣ Create FINAL result (merged!)
    const finalResult = new Result({
      studentId,
      Sem,
      course: course || prevResults[0].course,
      department: department || prevResults[0].department,
      type: 'final',  // 🔥 FINAL RESULT TYPE
      isRemedial: true,
      originalResultId: prevResults[0]._id,
      subjects: finalSubjects,
      published: false  // Admin publish karega
    });

    await finalResult.save();
    await finalResult.populate("studentId", "name EnrollmentNo course department");
    
    // 🎯 PASS/FAIL count
    const passCount = finalSubjects.filter(s => s.isPass).length;
    const totalCount = finalSubjects.length;
    
    console.log(`✅ FINAL RESULT created: ${passCount}/${totalCount} PASS`);
    res.json({
      success: true,
      message: `Final result created! ${passCount}/${totalCount} subjects PASS`,
      data: finalResult,
      failFixed: processedNewSubjects.length
    });

  } catch (err) {
    console.error("❌ Smart Remedial error:", err);
    res.status(500).json({ message: "Remedial failed", error: err.message });
  }
};

/* ================= TOGGLE PUBLISH (Admin Only) ================= */
const togglePublish = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id);
    if (!result) return res.status(404).json({ message: "Result not found" });

    result.published = !result.published;
    await result.save();

    console.log(`📢 ${result.published ? 'PUBLISHED' : 'UNPUBLISHED'}:`, result._id);
    res.json({ 
      success: true, 
      published: result.published,
      message: result.published ? "Result published for students!" : "Result unpublished"
    });
  } catch (err) {
    console.error("❌ Toggle publish error:", err);
    res.status(500).json({ message: "Publish toggle failed" });
  }
};

// ... ALL OTHER FUNCTIONS SAME (updateResult, updateSubject, etc.) ...
const updateResult = async (req, res) => {
  try {
    console.log("🔄 Update result ID:", req.params.id);
    
    const { subjects } = req.body;
    
    if (!subjects || !Array.isArray(subjects)) {
      return res.status(400).json({ message: "Subjects array required" });
    }

    const processedSubjects = subjects
      .map(s => ({
        name: s.name?.trim() || "Unnamed",
        marks: Number(s.marks) || 0,
        maxMarks: Number(s.maxMarks) || 70
      }))
      .filter(s => s.name);

    const result = await Result.findByIdAndUpdate(
      req.params.id,
      { subjects: processedSubjects, updatedAt: new Date(), published: false },
      { new: true, runValidators: true }
    ).populate("studentId", "name EnrollmentNo course department");

    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    console.log("✅ Result updated:", result._id);
    res.json({ success: true, data: result });

  } catch (err) {
    console.error("❌ UpdateResult error:", err);
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

// Keep all other functions EXACTLY same...
const updateSubject = async (req, res) => {
  try {
    const { resultId, subjectId, name, marks } = req.body;

    const result = await Result.findById(resultId);
    if (!result) return res.status(404).json({ message: "Result not found" });

    const subject = result.subjects.id(subjectId);
    if (!subject) return res.status(404).json({ message: "Subject not found" });

    if (marks > (subject.maxMarks || 70)) {
      return res.status(400).json({ message: `Marks ≤ ${subject.maxMarks || 70}` });
    }

    subject.name = name || subject.name;
    subject.marks = Number(marks);

    await result.save();
    res.json({ success: true });
  } catch (err) {
    console.error("❌ UpdateSubject error:", err);
    res.status(500).json({ message: "Update failed" });
  }
};

const addSubject = async (req, res) => {
  try {
    const { resultId, subject } = req.body;

    if (!resultId || !subject?.name) {
      return res.status(400).json({ message: "resultId and subject.name required" });
    }

    const result = await Result.findById(resultId);
    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    result.subjects.push({
      name: subject.name.trim(),
      marks: Number(subject.marks) || 0,
      maxMarks: Number(subject.maxMarks) || 70
    });

    await result.save();
    await result.populate("studentId", "name EnrollmentId course department");

    console.log("✅ Subject added:", resultId);
    res.json({ success: true, data: result });

  } catch (err) {
    console.error("❌ Add subject error:", err);
    res.status(500).json({ message: "Add failed" });
  }
};

const deleteSubject = async (req, res) => {
  try {
    const { resultId, subjectId } = req.params;
    const result = await Result.findById(resultId);
    if (!result) return res.status(404).json({ message: "Result not found" });

    const deletedSubject = result.subjects.pull(subjectId);
    if (!deletedSubject) return res.status(404).json({ message: "Subject not found" });

    await result.save();
    res.json({ success: true, message: "Subject deleted" });
  } catch (err) {
    console.error("❌ Delete subject error:", err);
    res.status(500).json({ message: "Delete failed" });
  }
};

const deleteResultById = async (req, res) => {
  try {
    const result = await Result.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: "Result not found" });
    res.json({ success: true, message: "Result deleted", deletedId: result._id });
  } catch (err) {
    console.error("❌ Delete result error:", err);
    res.status(500).json({ message: "Delete failed" });
  }
};

const deleteSemester = async (req, res) => {
  try {
    const { studentId, Sem } = req.params;
    const del = await Result.deleteMany({ studentId, Sem: new RegExp(`^${Sem}$`, "i") });
    if (del.deletedCount === 0) return res.status(404).json({ message: "No records found" });
    res.json({ success: true, deleted: del.deletedCount });
  } catch (err) {
    console.error("❌ Delete semester error:", err);
    res.status(500).json({ message: "Delete failed" });
  }
};

/* ================= EXPORTS - ALL FUNCTIONS ✅ ================= */
module.exports = {
  getResults,
  getPublishedResults,
  getStudentResults,
  getResultById,
  addOrUpdateResult,
  smartRemedial,
  updateResult,
  togglePublish,
  updateSubject,
  addSubject,
  deleteSubject,
  deleteResultById,
  deleteSemester
};

