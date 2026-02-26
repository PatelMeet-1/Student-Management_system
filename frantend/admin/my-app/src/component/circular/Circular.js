import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import PdfForm from "../circular/PdfForm";
import PdfList from "../circular/PdfList";
import Loader from "../loader";

// 🔥 FIXED API_URL for Render.com
const BASE_URL = process.env.REACT_APP_API_URL.replace('/api', '') || 'https://student-management-system-th5w.onrender.com';
const API_URL = `${BASE_URL}/api/circular`;

console.log("🚀 API_URL:", API_URL);

export default function Circular() {
  const [circulars, setCirculars] = useState([]);
  const [pdf, setPdf] = useState(null);
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);
  const [filters, setFilters] = useState({ description: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCirculars();
  }, []);

  // 🔥 FIXED FETCH with Render.com support
  const fetchCirculars = async () => {
    try {
      setLoading(true);
      console.log("🔍 GET:", API_URL);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      
      const res = await axios.get(API_URL, {
        signal: controller.signal,
        timeout: 30000,
      });
      
      clearTimeout(timeoutId);
      console.log("✅ DATA:", res.data);
      
      setCirculars(Array.isArray(res.data) ? res.data : []);
      toast.success(`✅ Loaded ${res.data?.length || 0} circulars`);
      
    } catch (err) {
      console.error("❌ FETCH ERROR:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        url: err.config?.url
      });
      
      if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        toast.warning("⏰ Server waking up... 🔄");
        setTimeout(fetchCirculars, 3000);
      } else if (err.response?.status === 404) {
        toast.error("🔍 API not found - Check backend route");
      } else {
        toast.error(`❌ ${err.response?.status || err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔥 FIXED FORM SUBMIT
  // 🔥 NO event here
const handleSubmit = async () => {
  if (!description.trim()) {
    toast.error("📝 Description required");
    return;
  }

  const formData = new FormData();
  formData.append("description", description.trim());
  if (pdf) formData.append("pdf", pdf);

  try {
    setLoading(true);

    if (editId) {
      await axios.put(`${API_URL}/${editId}`, formData);
      toast.success("✅ Circular Updated!");
    } else {
      await axios.post(API_URL, formData);
      toast.success("✅ Circular Added!");
    }

    resetForm();
    fetchCirculars();
  } catch (err) {
    toast.error("❌ Save failed");
  } finally {
    setLoading(false);
  }
};

  const handleEdit = (item) => {
    setDescription(item.description || "");
    setEditId(item._id);
    setPdf(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this circular?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      toast.success("✅ Deleted!");
      fetchCirculars();
    } catch (err) {
      toast.error("❌ Delete failed");
    }
  };

  const resetForm = () => {
    setDescription("");
    setPdf(null);
    setEditId(null);
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = null;
  };

  // 🔥 WAKE UP SERVER
  const wakeUpServer = async () => {
    try {
      toast.info("⚡ Waking server...");
      await axios.get(`${BASE_URL}/api/health`, { timeout: 10000 });
      toast.success("✅ Server ready!");
      setTimeout(fetchCirculars, 2000);
    } catch (err) {
      toast.warning("Wake-up failed - Try refresh");
    }
  };

  const filteredCirculars = circulars.filter((item) =>
    item.description.toLowerCase().includes(filters.description.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <ToastContainer position="top-right" />
      {loading && <Loader />}

      <h3 className="text-center mb-4">📄 Circular Manager</h3>

      {/* FORM */}
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

      {/* FILTER */}
      <div className="card p-3 mb-4">
        <h6>🔍 Filter</h6>
        <div className="row g-2">
          <div className="col-md-10">
            <input
              className="form-control"
              placeholder="Search circulars..."
              value={filters.description}
              onChange={(e) => setFilters({ ...filters, description: e.target.value })}
            />
          </div>
          <div className="col-md-2">
            <button className="btn btn-outline-secondary w-100" onClick={() => setFilters({ description: "" })}>
              🧹 Clear
            </button>
          </div>
        </div>
      </div>

      {/* LIST */}
      <div className="card shadow">
        <div className="card-header bg-success text-white p-3 d-flex justify-content-between align-items-center">
          <h5>📋 Circulars ({filteredCirculars.length}/{circulars.length})</h5>
          <div>
            <button className="btn btn-light btn-sm me-2" onClick={fetchCirculars}>🔄 Refresh</button>
            <button className="btn btn-warning btn-sm" onClick={wakeUpServer}>⚡ Wake</button>
          </div>
        </div>
        <div className="card-body p-0">
          <PdfList data={filteredCirculars} onEdit={handleEdit} onDelete={handleDelete} baseUrl={BASE_URL} />
        </div>
      </div>
    </div>
  );
}
