// Timetable.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import PdfForm from "../circular/PdfForm";
import PdfList from "../circular/PdfList";
import Loader from "../loader";

const API_URL = `${process.env.REACT_APP_API_URL}/timetable`;

export default function Timetable() {
  const [timetables, setTimetables] = useState([]);
  const [pdf, setPdf] = useState(null);
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);
  const [filters, setFilters] = useState({ description: "" });
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    fetchTimetables();
  }, []);

  // 🔥 GET all
  const fetchTimetables = async () => {
    try {
      const res = await axios.get(API_URL);
      setTimetables(Array.isArray(res.data) ? res.data : []);
      toast.success(`Loaded ${Array.isArray(res.data) ? res.data.length : 0} timetables`);
    } catch (err) {
      console.error(err);
      toast.error("Error fetching timetables");
    }
  };

  // 🔥 ADD / UPDATE
 const handleSubmit = async () => {
  if (!description.trim()) return toast.error("Description required");

  const formData = new FormData();
  formData.append("description", description.trim());
  if (pdf) formData.append("pdf", pdf);

  const tokenKey = process.env.REACT_APP_ADMIN_TOKEN_KEY || "adminToken";
  const token = localStorage.getItem(tokenKey);
  const headers = {
    "Content-Type": "multipart/form-data",
  };
  if (token) {
    headers["Authorization"] = token;
  }

  try {
    setLoading(true); // 🔥 LOADER ON

    if (editId) {
      await axios.put(`${API_URL}/${editId}`, formData, { headers });
      toast.success("✅ Timetable Updated!");
    } else {
      await axios.post(API_URL, formData, { headers });
      toast.success("✅ Timetable Added!");
    }

    resetForm();
    fetchTimetables();
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.error || err.response?.data?.message || "❌ Error saving timetable");
  } finally {
    setLoading(false); // 🔥 LOADER OFF
  }
};


  // 🔥 EDIT
  const handleEdit = (item) => {
    setDescription(item.description || "");
    setEditId(item._id);
  };

  // 🔥 DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this timetable?")) return;

    const tokenKey = process.env.REACT_APP_ADMIN_TOKEN_KEY || "adminToken";
    const token = localStorage.getItem(tokenKey);
    const headers = {};
    if (token) {
      headers["Authorization"] = token;
    }

    try {
      await axios.delete(`${API_URL}/${id}`, { headers });
      toast.success("✅ Timetable Deleted!");
      fetchTimetables();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || err.response?.data?.message || "❌ Error deleting timetable");
    }
  };

  // 🔥 RESET FORM
  const resetForm = () => {
    setDescription("");
    setPdf(null);
    setEditId(null);
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = null;
  };

  // 🔥 FILTERED TIMETABLES
  const filteredTimetables = timetables.filter(item =>
    item.description.toLowerCase().includes(filters.description.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <ToastContainer />
      {loading && <Loader />}

    
    

      <h3 className="text-center mb-4">🕒 Timetable Manager</h3>

      

      {/* 🔥 FORM - ORIGINAL POSITION (TOP) */}
      <div className="card shadow mb-4">
        <div className="card-header bg-primary text-white p-3">
          <h5>{editId ? "✏️ Edit Timetable" : "➕ Add Timetable"}</h5>
        </div>
        <div className="card-body p-4">
          <PdfForm
            description={description}
            setDescription={setDescription}
            setPdf={setPdf}
            onSubmit={handleSubmit}
            editId={editId}
            onReset={resetForm}
            accept="application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,image/*"
            title="Timetable"
          />
        </div>
      </div>

{/* 🔥 FILTERS */}
      <div className="card p-3 mb-4">
        <h6>🔍 Filter by Description</h6>
        <div className="row g-2">
          <div className="col-md-10">
            <input 
              className="form-control" 
              placeholder="Search timetables..." 
              value={filters.description}
              onChange={(e) => setFilters({...filters, description: e.target.value})}
            />
          </div>
          <div className="col-md-2">
            <button className="btn btn-outline-secondary w-100" onClick={() => setFilters({description: ""})}>
              🧹
            </button>
          </div>
        </div>
      </div>
      
      {/* 🔥 TIMETABLES TABLE - ORIGINAL POSITION (BOTTOM) */}
      <div className="card shadow">
        <div className="card-header bg-success text-white p-3">
          <div className="d-flex justify-content-between align-items-center">
            <h5>📋 All Timetables ({filteredTimetables.length}/{timetables.length})</h5>
            <button className="btn btn-light btn-sm" onClick={fetchTimetables}>🔄 Refresh</button>
          </div>
        </div>
        <div className="card-body p-0">
          <PdfList
            data={filteredTimetables}
            onEdit={handleEdit}
            onDelete={handleDelete}
            title="Timetable"
          />
        </div>
      </div>
    </div>
  );
}
