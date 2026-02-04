const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/resultController");

// ---------------- BASIC ROUTES (TOP PRIORITY) ----------------
router.get("/", ctrl.getResults);                    // ✅ GET all results
router.post("/", ctrl.addOrUpdateResult);            // ✅ POST Excel upload

// 🔥 ================= REMEDIAL ROUTE - YE ADD KARO =================
router.post("/smart-remedial", ctrl.smartRemedial);  // ✅ NEW Remedial Magic!

// ---------------- CRITICAL FOR EDIT/DELETE ✅ ----------------
router.put("/:id", ctrl.updateResult);               // ✅ PUT /api/results/:id (Edit/Save)
router.get("/:id", ctrl.getResultById);              // ✅ GET single result
router.delete("/:id", ctrl.deleteResultById);        // ✅ DELETE single result

// ---------------- ADD SUBJECT ----------------
router.put("/add-subject", ctrl.addSubject);         // ✅ Add new subject

// ---------------- OTHER ROUTES (OPTIONAL) ----------------
router.get("/student/:studentId", ctrl.getStudentResults);
// router.put("/publish/:id", ctrl.publishResult);
router.delete("/semester/:studentId/:Sem", ctrl.deleteSemester);
router.put("/update-subject", ctrl.updateSubject);   // Legacy
router.delete("/subject/:resultId/:subjectId", ctrl.deleteSubject);

module.exports = router;
