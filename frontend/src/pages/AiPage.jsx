import { useEffect, useState, useRef } from "react";
import { api } from "../utils/api.js";
import { Card, Button, Spinner, Badge } from "../components/ui.jsx";
import { Sparkles, Send, RefreshCw, AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react";

const SEVERITY_CONFIG = {
  danger: { icon: XCircle, color: "var(--red)", bg: "var(--red-bg)", border: "rgba(239,68,68,0.3)", badge: "red" },
  warning: { icon: AlertTriangle, color: "var(--yellow)", bg: "var(--yellow-bg)", border: "rgba(234,179,8,0.3)", badge: "yellow" },
  info: { icon: Info, color: "var(--blue)", bg: "var(--blue-bg)", border: "rgba(59,130,246,0.3)", badge: "blue" },
  success: { icon: CheckCircle, color: "var(--green)", bg: "var(--green-bg)", border: "rgba(34,197,94,0.3)", badge: "green" },
};

const QUICK_QUESTIONS = [
  "How many days can I still work this year?",
  "What should I do if my visa expires soon?",
  "What's the difference between mini-job and part-time?",
  "What documents do I need for Anmeldung?",
  "Can I work for multiple employers in Germany?",
  "What happens if I exceed my work hour limit?",
];

export default function AiPage() {
  const [insights, setInsights] = useState([]);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef(null);

  const loadStored = async () => {
    setLoadingInsights(true);
    try {
      const { insights } = await api.getStoredInsights();
      const parsed = insights.map(i => {
        let data;
        try { data = JSON.parse(i.message); } catch { data = { title: i.type, message: i.message, type: i.severity }; }
        return { ...i, data };
      });
      setInsights(parsed);
      // Mark all as read
      for (const ins of parsed.filter(i => !i.is_read)) {
        api.markInsightRead(ins.id).catch(() => {});
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingInsights(false);
    }
  };

  const generateInsights = async () => {
    setGenerating(true);
    try {
      await api.getAiInsights();
      await loadStored();
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => { loadStored(); }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (question) => {
    const q = question || input.trim();
    if (!q || sending) return;
    setInput("");
    setSending(true);
    setMessages(m => [...m, { role: "user", text: q }]);
    try {
      const { answer } = await api.askAi(q);
      setMessages(m => [...m, { role: "assistant", text: answer }]);
    } catch (err) {
      setMessages(m => [...m, { role: "assistant", text: "Sorry, I couldn't get a response. Please try again.", error: true }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700 }}>AI Guidance</h1>
          <p style={{ color: "var(--text-3)", fontSize: 14, marginTop: 4 }}>
            Personalized compliance insights and answers for students in Germany
          </p>
        </div>
        <Button variant="primary" onClick={generateInsights} disabled={generating}>
          {generating ? <Spinner size={14} /> : <RefreshCw size={14} />}
          {generating ? "Analyzing…" : "Refresh insights"}
        </Button>
      </div>

      {/* Insights */}
      <Card>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <Sparkles size={18} color="var(--accent-2)" />
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700 }}>Smart Insights</h2>
        </div>

        {loadingInsights ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 32 }}><Spinner size={24} /></div>
        ) : insights.length === 0 ? (
          <div style={{ textAlign: "center", padding: 32 }}>
            <Sparkles size={32} color="var(--text-3)" style={{ margin: "0 auto 12px" }} />
            <div style={{ color: "var(--text-2)", fontWeight: 500, marginBottom: 6 }}>No insights yet</div>
            <div style={{ color: "var(--text-3)", fontSize: 13, marginBottom: 16 }}>
              Click "Refresh insights" to get AI-powered analysis of your work and document status
            </div>
            <Button variant="primary" onClick={generateInsights} disabled={generating}>
              {generating ? <Spinner size={14} /> : <Sparkles size={14} />}
              Generate insights
            </Button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {insights.map(insight => {
              const type = insight.data?.type || insight.severity || "info";
              const cfg = SEVERITY_CONFIG[type] || SEVERITY_CONFIG.info;
              const Icon = cfg.icon;
              return (
                <div key={insight.id} style={{
                  background: cfg.bg,
                  border: `1px solid ${cfg.border}`,
                  borderRadius: "var(--radius)",
                  padding: "16px 18px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 14,
                }}>
                  <Icon size={18} color={cfg.color} style={{ marginTop: 1, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text)", marginBottom: 4 }}>
                      {insight.data?.title || insight.type}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.5 }}>
                      {insight.data?.message}
                    </div>
                    {insight.data?.action && (
                      <div style={{
                        marginTop: 10, fontSize: 12, fontWeight: 600,
                        color: cfg.color,
                        display: "flex", alignItems: "center", gap: 6,
                      }}>
                        → {insight.data.action}
                      </div>
                    )}
                  </div>
                  <Badge color={cfg.badge}>{type}</Badge>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* AI Chat */}
      <Card>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <Sparkles size={18} color="var(--accent-2)" />
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700 }}>Ask AI</h2>
        </div>

        {/* Quick questions */}
        {messages.length === 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 10 }}>Quick questions:</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {QUICK_QUESTIONS.map(q => (
                <button key={q} onClick={() => sendMessage(q)} disabled={sending} style={{
                  padding: "6px 12px", borderRadius: 999, fontSize: 12, fontWeight: 500,
                  background: "var(--bg-3)", border: "1px solid var(--border)",
                  color: "var(--text-2)", cursor: "pointer", transition: "all 0.15s",
                }}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div style={{
          minHeight: 200, maxHeight: 400, overflowY: "auto",
          display: "flex", flexDirection: "column", gap: 14,
          marginBottom: 16,
          padding: messages.length > 0 ? "4px 0" : 0,
        }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}>
              <div style={{
                maxWidth: "80%",
                padding: "10px 14px",
                borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                background: msg.role === "user" ? "var(--accent)" : "var(--bg-3)",
                border: msg.role === "user" ? "none" : "1px solid var(--border)",
                color: msg.role === "user" ? "#fff" : (msg.error ? "var(--red)" : "var(--text)"),
                fontSize: 14,
                lineHeight: 1.6,
                whiteSpace: "pre-wrap",
              }}>
                {msg.text}
              </div>
            </div>
          ))}
          {sending && (
            <div style={{ display: "flex" }}>
              <div style={{
                padding: "10px 14px", borderRadius: "16px 16px 16px 4px",
                background: "var(--bg-3)", border: "1px solid var(--border)",
              }}>
                <Spinner size={16} />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div style={{ display: "flex", gap: 10 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="Ask about German work rules, visa, documents..."
            disabled={sending}
            style={{
              flex: 1, padding: "10px 14px",
              background: "var(--bg-3)", border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)", color: "var(--text)",
              fontSize: 14, outline: "none", fontFamily: "var(--font-body)",
            }}
          />
          <Button variant="primary" onClick={() => sendMessage()} disabled={sending || !input.trim()}>
            <Send size={15} />
          </Button>
        </div>
      </Card>
    </div>
  );
}
