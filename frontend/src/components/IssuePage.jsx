import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../auth/AuthProvider";

const API = "http://localhost:8080";

const BADGE_STYLE = {
    BACKLOG:     { bg: "#E8F0FE", color: "#1A56DB" },
    ASSIGNED:    { bg: "#FEF3C7", color: "#92400E" },
    IN_PROGRESS: { bg: "#D1FAE5", color: "#065F46" },
    FINISHED:    { bg: "#F3F4F6", color: "#374151" },
    ON_HOLD:     { bg: "#FEE2E2", color: "#991B1B" },
};
const BADGE_LABEL = {
    BACKLOG: "Backlog", ASSIGNED: "Assigned",
    IN_PROGRESS: "In progress", FINISHED: "Finished", ON_HOLD: "On hold",
};
const CATEGORY_MAP = { 1: "🕳️ Pothole / Road Damage", 2: "🖊️ Graffiti", 3: "🗑️ Illegal Dumping", 4: "💡 Broken Streetlight" };

function formatDate(iso) {
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}
function formatDateTime(iso) {
    return new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function IssuePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [issue, setIssue] = useState(null);
    const [comments, setComments] = useState([]);
    const [loadingIssue, setLoadingIssue] = useState(true);
    const [loadingComments, setLoadingComments] = useState(true);
    const [error, setError] = useState("");
    const [commentText, setCommentText] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [commentError, setCommentError] = useState("");

    useEffect(() => {
        axios.get(`${API}/api/issues/${id}`)
            .then(res => setIssue(res.data))
            .catch(() => setError("Issue not found or failed to load."))
            .finally(() => setLoadingIssue(false));

        axios.get(`${API}/api/issues/${id}/comments`)
            .then(res => setComments(res.data || []))
            .finally(() => setLoadingComments(false));
    }, [id]);

    const handleAddComment = async () => {
        if (!commentText.trim()) return;
        setSubmitting(true);
        setCommentError("");
        const token = localStorage.getItem("token");
        try {
            const res = await axios.post(
                `${API}/api/issues/${id}/comments`,
                { text: commentText },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setComments(prev => [...prev, res.data]);
            setCommentText("");
        } catch (err) {
            setCommentError(err?.response?.data?.message || "Failed to post comment.");
        } finally {
            setSubmitting(false);
        }
    };

    // ── Loading ──
    if (loadingIssue) return (
        <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center", color: "#6B7280" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
                <p>Loading issue…</p>
            </div>
        </div>
    );

    // ── Error ──
    if (error) return (
        <div style={{ maxWidth: 640, margin: "80px auto", textAlign: "center", padding: "0 24px" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>😕</div>
            <h2 style={{ color: "#0F172A", marginBottom: 8 }}>Issue not found</h2>
            <p style={{ color: "#6B7280", marginBottom: 24 }}>{error}</p>
            <button onClick={() => navigate("/")} style={{
                background: "#3B82F6", color: "#fff", border: "none",
                borderRadius: 10, padding: "10px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer",
            }}>← Back to Home</button>
        </div>
    );

    const badge = BADGE_STYLE[issue.status] || BADGE_STYLE.BACKLOG;
    const locationText = issue.address
        ? issue.address
        : (issue.latitude && issue.longitude)
            ? `${Number(issue.latitude).toFixed(5)}, ${Number(issue.longitude).toFixed(5)}`
            : "No location provided";

    return (
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 24px 64px", fontFamily: "system-ui, sans-serif" }}>

            {/* Back link */}
            <Link to="/" style={{ fontSize: 13, color: "#6B7280", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 24 }}>
                ← Back to all issues
            </Link>

            {/* ── Header card ── */}
            <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, overflow: "hidden", marginBottom: 20 }}>

                {/* Photo */}
                {issue.photoUrl && (
                    <div style={{ maxHeight: 380, overflow: "hidden", background: "#F3F4F6" }}>
                        <img src={issue.photoUrl} alt="Issue" style={{ width: "100%", objectFit: "cover", display: "block" }} />
                    </div>
                )}

                <div style={{ padding: "24px 28px" }}>
                    {/* Status + ID row */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
                        <span style={{ fontSize: 13, color: "#9CA3AF", fontFamily: "monospace" }}>Issue #{issue.id}</span>
                        <span style={{
                            fontSize: 12, fontWeight: 700, padding: "4px 14px", borderRadius: 20,
                            background: badge.bg, color: badge.color, letterSpacing: "0.04em",
                        }}>
                            {BADGE_LABEL[issue.status] || issue.status}
                        </span>
                    </div>

                    {/* Description */}
                    <p style={{ fontSize: 17, lineHeight: 1.65, color: "#111827", margin: "0 0 24px" }}>
                        {issue.description}
                    </p>

                    {/* Meta grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
                        {[
                            { icon: "📍", label: "Location", value: locationText },
                            { icon: "🗓", label: "Reported on", value: formatDate(issue.createdAt) },
                            { icon: "📂", label: "Category", value: CATEGORY_MAP[issue.categoryId] || `Category ${issue.categoryId}` },
                            { icon: "👤", label: "Reported by", value: issue.authorEmail ? issue.authorEmail.split("@")[0] : "Anonymous" },
                        ].map(item => (
                            <div key={item.label} style={{ background: "#F9FAFB", borderRadius: 10, padding: "12px 14px" }}>
                                <div style={{ fontSize: 11, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{item.label}</div>
                                <div style={{ fontSize: 14, color: "#111827", fontWeight: 500, wordBreak: "break-all" }}>
                                    {item.icon} {item.value}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Map link if coordinates */}
                    {issue.latitude && issue.longitude && (
                        <a
                            href={`https://www.openstreetmap.org/?mlat=${issue.latitude}&mlon=${issue.longitude}&zoom=16`}
                            target="_blank" rel="noreferrer"
                            style={{
                                display: "inline-block", marginTop: 16, fontSize: 13,
                                color: "#3B82F6", textDecoration: "none",
                            }}
                        >
                            🗺 View on map ↗
                        </a>
                    )}
                </div>
            </div>

            {/* ── Comments ── */}
            <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, padding: "24px 28px" }}>
                <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 700, color: "#0F172A" }}>
                    Comments {!loadingComments && <span style={{ color: "#9CA3AF", fontWeight: 400, fontSize: 14 }}>({comments.length})</span>}
                </h3>

                {/* Comment list */}
                {loadingComments && <p style={{ color: "#9CA3AF", fontSize: 14 }}>Loading comments…</p>}

                {!loadingComments && comments.length === 0 && (
                    <p style={{ color: "#9CA3AF", fontSize: 14, marginBottom: 24 }}>No comments yet. Be the first to comment.</p>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: comments.length ? 24 : 0 }}>
                    {comments.map(c => {
                        const isWorker = c.authorRole === "WORKER" || c.authorRole === "ADMIN";
                        return (
                            <div key={c.id} style={{
                                background: isWorker ? "#EFF6FF" : "#F9FAFB",
                                border: `1px solid ${isWorker ? "#BFDBFE" : "#E5E7EB"}`,
                                borderRadius: 12, padding: "12px 16px",
                            }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, gap: 8, flexWrap: "wrap" }}>
                                    <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>
                                        {isWorker ? "🔧 " : "👤 "}
                                        {c.authorEmail.split("@")[0]}
                                        {isWorker && (
                                            <span style={{ marginLeft: 6, fontSize: 11, background: "#DBEAFE", color: "#1D4ED8", padding: "1px 7px", borderRadius: 10, fontWeight: 500 }}>
                                                {c.authorRole}
                                            </span>
                                        )}
                                    </span>
                                    <span style={{ fontSize: 11, color: "#9CA3AF" }}>{formatDateTime(c.createdAt)}</span>
                                </div>
                                <p style={{ margin: 0, fontSize: 14, color: "#374151", lineHeight: 1.55 }}>{c.text}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Add comment — only if logged in */}
                {user ? (
                    <div style={{ borderTop: comments.length ? "1px solid #F3F4F6" : "none", paddingTop: comments.length ? 20 : 0 }}>
                        {commentError && (
                            <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#991B1B", marginBottom: 12 }}>
                                {commentError}
                            </div>
                        )}
                        <textarea
                            value={commentText}
                            onChange={e => setCommentText(e.target.value)}
                            placeholder="Add a comment…"
                            rows={3}
                            style={{
                                width: "100%", borderRadius: 10, border: "1px solid #E5E7EB",
                                padding: "10px 14px", fontSize: 14, resize: "vertical",
                                fontFamily: "inherit", outline: "none", boxSizing: "border-box",
                                transition: "border-color 0.15s",
                            }}
                            onFocus={e => e.target.style.borderColor = "#3B82F6"}
                            onBlur={e => e.target.style.borderColor = "#E5E7EB"}
                        />
                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
                            <button
                                onClick={handleAddComment}
                                disabled={submitting || !commentText.trim()}
                                style={{
                                    background: submitting || !commentText.trim() ? "#E5E7EB" : "#3B82F6",
                                    color: submitting || !commentText.trim() ? "#9CA3AF" : "#fff",
                                    border: "none", borderRadius: 10, padding: "9px 22px",
                                    fontSize: 14, fontWeight: 600, cursor: submitting || !commentText.trim() ? "default" : "pointer",
                                    transition: "background 0.15s",
                                }}
                            >
                                {submitting ? "Posting…" : "Post comment"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div style={{ borderTop: "1px solid #F3F4F6", paddingTop: 20, textAlign: "center", color: "#6B7280", fontSize: 14 }}>
                        <Link to="/login" style={{ color: "#3B82F6", textDecoration: "none", fontWeight: 600 }}>Log in</Link> to leave a comment.
                    </div>
                )}
            </div>
        </div>
    );
}