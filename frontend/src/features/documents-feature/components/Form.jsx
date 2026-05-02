import { Upload } from "lucide-react";
import { Button, Input, Select } from "../../../components/ui";
import { useState } from "react";
import { DOC_TYPES } from "../../../shared/lib/constant/constant";

export default function Form({ initial = {}, onSave, onClose }) {
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
    <form onSubmit={handleSubmit} style={{ display: "flex",  flexDirection: "column", gap: 14 }}>
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