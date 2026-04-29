import { useEffect, useState } from "react";
import { api } from "../utils/api.js";
import { Card, Badge, Button, Modal, Input, Select, Spinner } from "../components/ui.jsx";
import { Plus, FileText, Trash2, ExternalLink, Upload, Search } from "lucide-react";

const DOC_TYPES = [
  { value: "visa", label: "🛂 Visa" },
  { value: "residence_permit", label: "🏠 Residence Permit" },
  { value: "id_card", label: "🪪 ID Card" },
  { value: "passport", label: "📘 Passport" },
  { value: "health_insurance", label: "🏥 Health Insurance Card" },
  { value: "room_contract", label: "🏡 Room Contract" },
  { value: "university_enrollment", label: "🎓 University Enrollment" },
  { value: "train_ticket", label: "🚆 Train Ticket / Semester Pass" },
  { value: "work_contract", label: "💼 Work Contract" },
  { value: "tax_id", label: "📄 Tax ID (Steueridentifikationsnummer)" },
  { value: "anmeldung", label: "📋 Anmeldung (Registration)" },
  { value: "other", label: "📁 Other" },
];

function getExpiryBadge(daysLeft) {
  if (daysLeft === null) return null;
  if (daysLeft < 0) return <Badge color="red">EXPIRED</Badge>;
  if (daysLeft <= 30) return <Badge color="red">{daysLeft}d left</Badge>;
  if (daysLeft <= 90) return <Badge color="yellow">{daysLeft}d left</Badge>;
  return <Badge color="green">{daysLeft}d left</Badge>;
}

function DocCard({ doc, onEdit, onDelete }) {
  const typeLabel = DOC_TYPES.find(t => t.value === doc.type)?.label || doc.type;
  const daysLeft = doc.days_until_expiry;

  return (
    <Card style={{ position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 18 }}>{typeLabel.split(" ")[0]}</span>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 15, color: "var(--text)" }}>
              {doc.name}
            </span>
          </div>
          <div style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 8 }}>
            {typeLabel.split(" ").slice(1).join(" ")}
          </div>
          {doc.expiry_date && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              {getExpiryBadge(daysLeft)}
              <span style={{ fontSize: 12, color: "var(--text-3)" }}>
                Expires {doc.expiry_date}
              </span>
            </div>
          )}
          {!doc.expiry_date && (
            <Badge color="gray">No expiry</Badge>
          )}
          {doc.notes && (
            <p style={{ fontSize: 12, color: "var(--text-2)", marginTop: 8, fontStyle: "italic" }}>{doc.notes}</p>
          )}

          {/* Expiry bar */}
          {daysLeft !== null && (
            <div style={{ height: 3, background: "var(--bg-3)", borderRadius: 2, marginTop: 10, overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${daysLeft < 0 ? 100 : Math.max(0, Math.min(100, 100 - (daysLeft / 365) * 100))}%`,
                background: daysLeft < 0 ? "var(--red)" : daysLeft <= 30 ? "var(--red)" : daysLeft <= 90 ? "var(--yellow)" : "var(--green)",
                borderRadius: 2,
              }} />
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          {doc.file_path && (
            <Button variant="ghost" size="sm" onClick={() => window.open(api.getFileUrl(doc.file_path), "_blank")}>
              <ExternalLink size={13} />
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => onEdit(doc)}>
            Edit
          </Button>
          <Button variant="danger" size="sm" onClick={() => onDelete(doc.id)}>
            <Trash2 size={13} />
          </Button>
        </div>
      </div>
    </Card>
  );
}

function DocForm({ initial = {}, onSave, onClose }) {
  const [form, setForm] = useState({
    name: initial.name || "",
    type: initial.type || "visa",
    expiry_date: initial.expiry_date || "",
    notes: initial.notes || "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isEdit = !!initial.id;

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });
      if (file) fd.append("file", file);
      const result = isEdit
        ? await api.updateDocument(initial.id, fd)
        : await api.createDocument(fd);
      onSave(result.document);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Input label="Document name *" value={form.name} onChange={set("name")} required placeholder="e.g. Student Visa" />
      <Select label="Document type *" value={form.type} onChange={set("type")} options={DOC_TYPES} />
      <Input label="Expiry date" type="date" value={form.expiry_date} onChange={set("expiry_date")} />
      <Input label="Notes" value={form.notes} onChange={set("notes")} placeholder="Any additional info..." />

      <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-2)" }}>Attach file (PDF or image)</span>
        <div style={{
          border: "2px dashed var(--border-light)",
          borderRadius: "var(--radius-sm)", padding: 16,
          textAlign: "center", cursor: "pointer",
          background: file ? "var(--green-bg)" : "var(--bg-3)",
          transition: "all 0.15s",
        }}
          onClick={() => document.getElementById("file-upload").click()}
        >
          <Upload size={20} color="var(--text-3)" style={{ margin: "0 auto 6px" }} />
          <div style={{ fontSize: 12, color: "var(--text-3)" }}>
            {file ? file.name : "Click to upload (max 10MB)"}
          </div>
          <input id="file-upload" type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" style={{ display: "none" }}
            onChange={e => setFile(e.target.files[0])} />
        </div>
      </label>

      {error && <div style={{ background: "var(--red-bg)", border: "1px solid var(--red)", borderRadius: "var(--radius-sm)", padding: "10px 14px", color: "var(--red)", fontSize: 13 }}>{error}</div>}

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 4 }}>
        <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? <Spinner size={14} /> : null}
          {isEdit ? "Save changes" : "Add document"}
        </Button>
      </div>
    </form>
  );
}

export default function DocumentsPage() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'add' | doc-obj
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const load = () => {
    api.getDocuments().then(d => {
      setDocs(d.documents);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this document?")) return;
    await api.deleteDocument(id);
    setDocs(docs.filter(d => d.id !== id));
  };

  const handleSave = (doc) => {
    setDocs(prev => {
      const idx = prev.findIndex(d => d.id === doc.id);
      if (idx >= 0) { const n = [...prev]; n[idx] = doc; return n; }
      return [doc, ...prev];
    });
    setModal(null);
    load(); // refresh to get computed fields
  };

  const filtered = docs.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.type.includes(search.toLowerCase());
    if (filter === "expiring") return matchSearch && d.days_until_expiry !== null && d.days_until_expiry <= 90;
    if (filter === "expired") return matchSearch && d.days_until_expiry !== null && d.days_until_expiry < 0;
    return matchSearch;
  });

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700 }}>Documents</h1>
          <p style={{ color: "var(--text-3)", fontSize: 14, marginTop: 4 }}>Track your important documents and expiry dates</p>
        </div>
        <Button variant="primary" onClick={() => setModal("add")}>
          <Plus size={15} /> Add document
        </Button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
          <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)" }} />
          <input
            placeholder="Search documents..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%", paddingLeft: 36, paddingRight: 12, paddingTop: 9, paddingBottom: 9,
              background: "var(--bg-2)", border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)", color: "var(--text)", fontSize: 13,
              outline: "none", fontFamily: "var(--font-body)",
            }}
          />
        </div>
        {["all", "expiring", "expired"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "8px 16px", borderRadius: "var(--radius-sm)", fontSize: 13, fontWeight: 500,
            background: filter === f ? "var(--bg-3)" : "var(--bg-2)",
            border: filter === f ? "1px solid var(--border-light)" : "1px solid var(--border)",
            color: filter === f ? "var(--text)" : "var(--text-3)",
            cursor: "pointer", textTransform: "capitalize",
          }}>
            {f === "all" ? `All (${docs.length})` : f === "expiring" ? `Expiring soon (${docs.filter(d => d.days_until_expiry !== null && d.days_until_expiry >= 0 && d.days_until_expiry <= 90).length})` : `Expired (${docs.filter(d => d.days_until_expiry !== null && d.days_until_expiry < 0).length})`}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><Spinner size={28} /></div>
      ) : filtered.length === 0 ? (
        <Card style={{ textAlign: "center", padding: 60 }}>
          <FileText size={40} color="var(--text-3)" style={{ margin: "0 auto 16px" }} />
          <div style={{ color: "var(--text-2)", fontWeight: 500 }}>No documents yet</div>
          <div style={{ color: "var(--text-3)", fontSize: 13, marginTop: 4 }}>Add your visa, residence permit, and other important documents</div>
          <Button variant="primary" style={{ marginTop: 20 }} onClick={() => setModal("add")}>
            <Plus size={14} /> Add first document
          </Button>
        </Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map(doc => (
            <DocCard key={doc.id} doc={doc} onEdit={setModal} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal === "add" ? "Add document" : "Edit document"}
      >
        {modal && (
          <DocForm
            initial={modal === "add" ? {} : modal}
            onSave={handleSave}
            onClose={() => setModal(null)}
          />
        )}
      </Modal>
    </div>
  );
}
