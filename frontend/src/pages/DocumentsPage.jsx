import { useEffect, useState } from "react";
import { api } from "../utils/api.js";
import { Card, Badge, Button, Modal, Input, Select, Spinner } from "../components/ui.jsx";
import { Plus, FileText, Trash2, ExternalLink, Upload, Search } from "lucide-react";
import Form from "../features/documents-feature/components/Form.jsx";

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
          <Form
            initial={modal === "add" ? {} : modal}
            onSave={handleSave}
            onClose={() => setModal(null)}
          />
        )}
      </Modal>
    </div>
  );
}
