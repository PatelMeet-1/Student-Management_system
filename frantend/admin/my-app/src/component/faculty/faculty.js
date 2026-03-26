import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Loader from "../loader";

export default function ContactMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState({});

  const fetchMessages = async () => {
    setLoading(true);
    try {
      // ✅ FIXED: Proper URL construction
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
      const url = `${apiUrl}/contact`;
      console.log("🔍 Fetching from:", url);
      
      const res = await axios.get(url);
      setMessages(Array.isArray(res.data) ? res.data : []);
      toast.success(`✅ Loaded ${res.data?.length || 0} messages`);
    } catch (error) {
      console.error("❌ Error:", error.response?.status, error.message);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Delete this message permanently?")) return;
    
    setDeleteLoading(prev => ({ ...prev, [id]: true }));
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
      await axios.delete(`${apiUrl}/contact/${id}`);
      toast.success("✅ Message deleted!");
      fetchMessages();
    } catch (error) {
      toast.error("❌ Delete failed");
    } finally {
      setDeleteLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const filteredMessages = messages.filter(msg =>
    msg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="container-fluid mt-4">
      <ToastContainer />
      {loading && <Loader />}

      {/* Header */}
      <div className="row mb-4">
        <div className="col">
          <h2 className="text-primary mb-2">
            📧 Contact Messages 
            <span className="badge bg-light text-dark ms-2 fs-6">({messages.length})</span>
          </h2>
        </div>
        <div className="col-auto">
          <button 
            className="btn btn-success me-2" 
            onClick={fetchMessages}
            disabled={loading}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="card shadow mb-4">
        <div className="card-body p-3">
          <div className="input-group input-group-lg">
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input
              className="form-control border-start-0 ps-0"
              placeholder="Search by name, email, subject, or message..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card shadow">
        <div className="card-header bg-gradient text-white p-3">
          <h5 className="mb-0">
            📋 All Messages 
            <span className="badge bg-warning text-dark ms-2">
              {filteredMessages.length} of {messages.length}
            </span>
          </h5>
        </div>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-dark">
              <tr>
                <th style={{width: '50px'}}>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Message Preview</th>
                <th style={{width: '120px'}}>Date</th>
                <th style={{width: '100px'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMessages.map((msg, index) => (
                <tr key={msg._id}>
                  <td><strong>{index + 1}</strong></td>
                  <td>
                    <strong className="text-primary d-block">{msg.name}</strong>
                  </td>
                  <td className="text-muted small">{msg.email}</td>
                  <td>
                    <span className="badge bg-info">
                      {msg.subject?.length > 25 ? `${msg.subject.substring(0, 25)}...` : msg.subject}
                    </span>
                  </td>
                  <td className="small" style={{maxWidth: '200px'}} title={msg.message}>
                    {msg.message?.length > 40 ? `${msg.message.substring(0, 40)}...` : msg.message}
                  </td>
                  <td className="small text-muted">
                    {new Date(msg.createdAt).toLocaleString('en-IN', {
                      dateStyle: 'short',
                      timeStyle: 'short'
                    })}
                  </td>
                  <td>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => deleteMessage(msg._id)}
                      disabled={deleteLoading[msg._id]}
                      title="Delete message"
                    >
                      {deleteLoading[msg._id] ? (
                        <span className="spinner-border spinner-border-sm"></span>
                      ) : (
                        <i className="bi bi-trash"></i>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredMessages.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-5">
                    <i className="bi bi-envelope display-4 text-muted opacity-50 mb-3 d-block"></i>
                    <h5 className="text-muted">
                      {searchTerm ? "No matching messages" : "No messages found"}
                    </h5>
                    {searchTerm && (
                      <button 
                        className="btn btn-outline-secondary btn-sm mt-2" 
                        onClick={() => setSearchTerm("")}
                      >
                        Clear Search
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}