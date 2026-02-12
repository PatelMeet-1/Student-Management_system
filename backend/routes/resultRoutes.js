const express = require("express");  // ✅ FIXED
const router = express.Router();     // ✅ FIXED
const ctrl = require("../controllers/resultController");

// 🔥 1️⃣ BASIC ROUTES
router.get("/", ctrl.getResults);                   
router.post("/", ctrl.addOrUpdateResult);           

// 🔥 2️⃣ PUBLISH ROUTES (CRITICAL!)
router.get("/published", ctrl.getPublishedResults);  // Student dashboard
router.patch("/:id/publish", ctrl.togglePublish);    // Publish button

// 🔥 3️⃣ REMEDIAL
router.post("/smart-remedial", ctrl.smartRemedial);  

// 🔥 4️⃣ EDIT/CRUD
router.put("/:id", ctrl.updateResult);
router.get("/:id", ctrl.getResultById); 
router.delete("/:id", ctrl.deleteResultById);
router.put("/add-subject", ctrl.addSubject);

// 🔥 5️⃣ STUDENT SPECIFIC
router.get("/student/:studentId", ctrl.getStudentResults);

// 🔥 6️⃣ UTILITY
router.delete("/semester/:studentId/:Sem", ctrl.deleteSemester);
router.put("/update-subject", ctrl.updateSubject);
router.delete("/subject/:resultId/:subjectId", ctrl.deleteSubject);

module.exports = router;
