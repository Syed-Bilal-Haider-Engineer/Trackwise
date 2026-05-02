import { ExternalLink, Trash2 } from "lucide-react";
import { Badge, Button, Card } from "../../../components/ui";
import { DOC_TYPES } from "../../../shared/lib/constant/constant";

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