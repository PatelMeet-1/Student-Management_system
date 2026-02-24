// Circular.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import PdfForm from "../circular/PdfForm";
import PdfList from "../circular/PdfList";
import Loader from "../loader";

const API_URL = `${process.env.REACT_APP_API_URL}/api/circular`;

export default function Circular() {
  const [circulars, setCirculars] = useState([]);
  const [pdf, setPdf] = useState(null);
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);
  const [filters, setFilters] = useState({ description: "" });
  const [loading, setLoading] = useState(false);


  // 🔥 LOAD CIRCULARS
  useEffect(() => {
    fetchCirculars();
  }, []);

  const fetchCirculars = async () => {
    try {
      const res = await axios.get(API_URL);
      setCirculars(Array.isArray(res.data) ? res.data : []);
      toast.success(`Loaded ${Array.isArray(res.data) ? res.data.length : 0} circulars`);
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Error fetching circulars");
    }
  };

  // 🔥 ADD / UPDATE
 const handleSubmit = async () => {
  if (!description.trim()) return toast.error("Description required");

  const formData = new FormData();
  formData.append("description", description.trim());
  if (pdf) formData.append("pdf", pdf);

  try {
    setLoading(true); // 🔥 LOADER ON

    if (editId) {
      await axios.put(`${API_URL}/${editId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("✅ Circular Updated!");
    } else {
      await axios.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("✅ Circular Added!");
    }

    resetForm();
    fetchCirculars();
  } catch (err) {
    console.error(err.response?.data || err.message);
    toast.error("❌ Error saving circular");
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
    if (!window.confirm("Delete this circular?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      toast.success("✅ Circular Deleted!");
      fetchCirculars();
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("❌ Error deleting circular");
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

  // 🔥 FILTERED CIRCULARS
  const filteredCirculars = circulars.filter(item =>
    item.description.toLowerCase().includes(filters.description.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <ToastContainer />
      {loading && <Loader />}

      {/* 🔥 STATS */}
      
      <h3 className="text-center mb-4">📄 Circular Manager</h3>

      

      {/* 🔥 FORM - ORIGINAL POSITION (TOP) */}
      <div className="card shadow mb-4">
        <div className="card-header bg-primary text-white p-3">
          <h5>{editId ? "✏️ Edit Circular" : "➕ Add Circular"}</h5>
        </div>
        <div className="card-body p-4">
          <PdfForm
            description={description}
            setDescription={setDescription}
            setPdf={setPdf}
            onSubmit={handleSubmit}
            editId={editId}
            onReset={resetForm}
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
              placeholder="Search circulars..." 
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

      {/* 🔥 CIRCULARS TABLE - ORIGINAL POSITION (BOTTOM) */}
      <div className="card shadow">
        <div className="card-header bg-success text-white p-3">
          <div className="d-flex justify-content-between align-items-center">
            <h5>📋 All Circulars ({filteredCirculars.length}/{circulars.length})</h5>
            <button className="btn btn-light btn-sm" onClick={fetchCirculars}>🔄 Refresh</button>
          </div>
        </div>
        <div className="card-body p-0">
          <PdfList
            data={filteredCirculars}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
