import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "http://localhost:8000/api/tickets/";

export default function App() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({});

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("technical");
  const [priority, setPriority] = useState("medium");

  const [search, setSearch] = useState("");
  const [fCategory, setFCategory] = useState("");
  const [fPriority, setFPriority] = useState("");
  const [fStatus, setFStatus] = useState("");

  const [loadingAI, setLoadingAI] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [closingId, setClosingId] = useState(null);
  const [comment, setComment] = useState("");

  // ================= FETCH =================
  const fetchTickets = async () => {
    let url = API + "?";

    if (search) url += `search=${search}&`;
    if (fCategory) url += `category=${fCategory}&`;
    if (fPriority) url += `priority=${fPriority}&`;
    if (fStatus) url += `status=${fStatus}&`;

    const res = await axios.get(url);
    setTickets(res.data);
  };

  const fetchStats = async () => {
    const res = await axios.get(API + "stats/");
    setStats(res.data);
  };

  useEffect(() => {
    fetchTickets();
    fetchStats();
  }, [search, fCategory, fPriority, fStatus]);

  // ================= LLM SUGGEST =================
  useEffect(() => {
    if (!description) return;

    const timer = setTimeout(async () => {
      try {
        setLoadingAI(true);

        const res = await axios.post(API + "classify/", {
          description,
        });

        if (res.data.suggested_category)
          setCategory(res.data.suggested_category);

        if (res.data.suggested_priority)
          setPriority(res.data.suggested_priority);
      } catch {}
      setLoadingAI(false);
    }, 700);

    return () => clearTimeout(timer);
  }, [description]);

  // ================= CREATE =================
  const createTicket = async () => {
    if (!title || !description) return alert("Fill fields");

    await axios.post(API, {
      title,
      description,
      category,
      priority,
    });

    setTitle("");
    setDescription("");
    fetchTickets();
    fetchStats();
  };

  // ================= RESOLVE =================
  const resolveTicket = async (id) => {
    await axios.patch(`${API}${id}/`, { status: "resolved" });
    alert("Thanks! Ticket resolved");
    fetchTickets();
    fetchStats();
  };

  // ================= CLOSE =================
  const openCloseModal = (id) => {
    setClosingId(id);
    setShowModal(true);
  };

  const submitClose = async () => {
    await axios.patch(`${API}${closingId}/`, {
      status: "closed",
      comment,
    });

    setShowModal(false);
    setComment("");
    fetchTickets();
    fetchStats();
  };

  // ================= DELETE =================
  const deleteTicket = async (id) => {
    if (!confirm("Delete ticket?")) return;
    await axios.delete(`${API}${id}/delete/`);
    fetchTickets();
    fetchStats();
  };

  return (
    <div className="page">
      <div className="hero">
        <h1>Support Ticket System</h1>

        {/* CREATE */}
        <div className="card">
          <h2>Create Ticket</h2>

          <input
            placeholder="Title"
            maxLength={200}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {loadingAI && <div className="ai">AI suggesting...</div>}

          <div className="row">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="technical">Technical</option>
              <option value="billing">Billing</option>
              <option value="account">Account</option>
              <option value="general">General</option>
            </select>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <button className="primary" onClick={createTicket}>
            Submit Ticket
          </button>
        </div>

        {/* FILTERS */}
        <div className="filters">
          <input
            placeholder="Search"
            onChange={(e) => setSearch(e.target.value)}
          />

          <select onChange={(e) => setFCategory(e.target.value)}>
            <option value="">All Category</option>
            <option value="technical">Technical</option>
            <option value="billing">Billing</option>
            <option value="account">Account</option>
            <option value="general">General</option>
          </select>

          <select onChange={(e) => setFPriority(e.target.value)}>
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>

          <select onChange={(e) => setFStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {/* STATS */}
        <div className="stats">
          <span>Total: {stats.total_tickets || 0}</span>
          <span>Open: {stats.open_tickets || 0}</span>
          <span>Avg/day: {Math.round(stats.avg_tickets_per_day || 0)}</span>
        </div>

        {/* LIST */}
        <div className="card">
          <h2>Tickets</h2>

          {tickets.length === 0 && <p>No tickets</p>}

          {tickets.map((t) => (
            <div key={t.id} className="ticket">
              <div>
                <b>{t.title}</b>
                <p>{t.description}</p>
                <span className="tag">{t.category}</span>
                <span className="tag">{t.priority}</span>
                <span className="tag">{t.status}</span>
              </div>

              <div className="actions">
                <button onClick={() => resolveTicket(t.id)}>Resolve</button>
                <button onClick={() => openCloseModal(t.id)}>Close</button>
                <button className="danger" onClick={() => deleteTicket(t.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* MODAL */}
        {showModal && (
          <div className="modal">
            <div className="modal-box">
              <h3>Closing Comment</h3>

              <textarea
                placeholder="Write comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              <div className="row">
                <button onClick={submitClose}>Submit</button>
                <button onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
