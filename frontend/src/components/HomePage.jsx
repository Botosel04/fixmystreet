import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const BADGE_STYLE = {
    BACKLOG:     { bg: "#E8F0FE", color: "#1A56DB" },
    ASSIGNED:    { bg: "#FEF3C7", color: "#92400E" },
    IN_PROGRESS: { bg: "#D1FAE5", color: "#065F46" },
    FINISHED:    { bg: "#F3F4F6", color: "#374151" },
    ON_HOLD:     { bg: "#FEE2E2", color: "#991B1B" },
};

const BADGE_LABEL = {
    BACKLOG: "Backlog",
    ASSIGNED: "Assigned",
    IN_PROGRESS: "In progress",
    FINISHED: "Finished",
    ON_HOLD: "On hold",
};

const CATEGORY_ICON = { 1: "🕳️", 2: "🖊️", 3: "🗑️", 4: "💡" };

function locationText(issue) {
    if (issue.address) return issue.address;
    if (issue.latitude && issue.longitude)
        return `${Number(issue.latitude).toFixed(4)}, ${Number(issue.longitude).toFixed(4)}`;
    return "No location";
}

function formatDate(iso) {
    return new Date(iso).toLocaleDateString("en-GB", {
        day: "numeric", month: "short", year: "numeric",
    });
}

function IssueCard({ issue }) {
    const badge = BADGE_STYLE[issue.status] || BADGE_STYLE.BACKLOG;
    const icon = CATEGORY_ICON[issue.categoryId] || "📌";
    const [imgError, setImgError] = useState(false);

    return (
        <Link to={`/issues/${issue.id}`} style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{
                background: "#fff",
                border: "1px solid #E5E7EB",
                borderRadius: 16,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                transition: "box-shadow 0.2s ease, transform 0.2s ease",
                cursor: "default",
            }}
                 onMouseEnter={e => {
                     e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.10)";
                     e.currentTarget.style.transform = "translateY(-2px)";
                 }}
                 onMouseLeave={e => {
                     e.currentTarget.style.boxShadow = "none";
                     e.currentTarget.style.transform = "translateY(0)";
                 }}
            >
                {/* Photo */}
                {issue.photoUrl && !imgError && (
                    <div style={{ height: 160, overflow: "hidden", background: "#F3F4F6" }}>
                        <img
                            src={issue.photoUrl}
                            alt="Issue photo"
                            onError={() => setImgError(true)}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    </div>
                )}

                <div style={{ padding: "1rem 1.125rem", flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                    {/* Top row */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 12, color: "#9CA3AF", fontFamily: "monospace" }}>
                            {icon} #{issue.id}
                        </span>
                        <span style={{
                            fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20,
                            background: badge.bg, color: badge.color, letterSpacing: "0.02em",
                        }}>
                            {BADGE_LABEL[issue.status] || issue.status}
                        </span>
                    </div>

                    {/* Description */}
                    <p style={{
                        fontSize: 14, margin: 0, lineHeight: 1.55, color: "#111827",
                        display: "-webkit-box", WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical", overflow: "hidden",
                    }}>
                        {issue.description}
                    </p>

                    {/* Meta */}
                    <div style={{
                        marginTop: "auto", borderTop: "1px solid #F3F4F6",
                        paddingTop: 10, display: "flex", flexDirection: "column", gap: 4,
                    }}>
                        <span style={{ fontSize: 12, color: "#6B7280", display: "flex", alignItems: "center", gap: 5 }}>
                            📍 <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{locationText(issue)}</span>
                        </span>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ fontSize: 12, color: "#6B7280" }}>
                                🗓 {formatDate(issue.createdAt)}
                            </span>
                            <span style={{ fontSize: 12, color: "#6B7280", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {issue.authorEmail ? `👤 ${issue.authorEmail.split("@")[0]}` : "👤 Anonymous"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default function HomePage() {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:8080/api/issues/all")
            .then(res => setIssues(res.data || []))
            .catch(err => setError(err?.response?.data?.message || err.message))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div style={{ textAlign: "left", fontFamily: "system-ui, sans-serif" }}>

            {/* ── Hero ─────────────────────────────────────── */}
            <div style={{
                background: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%)",
                color: "#fff",
                padding: "72px 24px 80px",
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
            }}>
                {/* subtle dot pattern */}
                <div style={{
                    position: "absolute", inset: 0, opacity: 0.07,
                    backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                }} />

                <div style={{ position: "relative", maxWidth: 640, margin: "0 auto" }}>
                    <div style={{
                        display: "inline-block", background: "rgba(255,255,255,0.12)",
                        borderRadius: 20, padding: "4px 14px", fontSize: 13,
                        color: "#93C5FD", marginBottom: 20, letterSpacing: "0.04em",
                    }}>
                        Smart City · Cluj-Napoca
                    </div>

                    <h1 style={{
                        fontSize: "clamp(2rem, 5vw, 3.25rem)", fontWeight: 800,
                        margin: "0 0 16px", lineHeight: 1.15, letterSpacing: "-0.02em",
                    }}>
                        Welcome to{" "}
                        <span style={{
                            background: "linear-gradient(90deg, #60A5FA, #34D399)",
                            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                        }}>
                            Fix My Street
                        </span>
                    </h1>

                    <p style={{
                        fontSize: 17, color: "#CBD5E1", lineHeight: 1.65,
                        margin: "0 0 36px", maxWidth: 480, marginLeft: "auto", marginRight: "auto",
                    }}>
                        Spot a pothole, broken streetlight, or illegal dumping?
                        Report it in seconds and help keep our city clean and safe.
                    </p>

                    <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                        <button
                            onClick={() => navigate("/report")}
                            style={{
                                background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
                                color: "#fff", border: "none", borderRadius: 12,
                                padding: "14px 32px", fontSize: 15, fontWeight: 700,
                                cursor: "pointer", letterSpacing: "0.01em",
                                boxShadow: "0 4px 20px rgba(59,130,246,0.4)",
                                transition: "transform 0.15s ease, box-shadow 0.15s ease",
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = "translateY(-2px)";
                                e.currentTarget.style.boxShadow = "0 8px 28px rgba(59,130,246,0.5)";
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 4px 20px rgba(59,130,246,0.4)";
                            }}
                        >
                            🚨 Report an Issue
                        </button>
                        <button
                            onClick={() => document.getElementById("issues-section").scrollIntoView({ behavior: "smooth" })}
                            style={{
                                background: "rgba(255,255,255,0.08)", color: "#fff",
                                border: "1px solid rgba(255,255,255,0.2)", borderRadius: 12,
                                padding: "14px 28px", fontSize: 15, fontWeight: 600,
                                cursor: "pointer", backdropFilter: "blur(4px)",
                                transition: "background 0.15s ease",
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
                            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                        >
                            View Reports ↓
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Stats strip ───────────────────────────────── */}
            {!loading && issues.length > 0 && (
                <div style={{
                    background: "#F8FAFC", borderBottom: "1px solid #E5E7EB",
                    padding: "20px 24px", display: "flex", justifyContent: "center", gap: 48,
                    flexWrap: "wrap",
                }}>
                    {[
                        { label: "Total reports", value: issues.length },
                        { label: "Open", value: issues.filter(i => i.status === "BACKLOG").length },
                        { label: "In progress", value: issues.filter(i => i.status === "IN_PROGRESS" || i.status === "ASSIGNED").length },
                        { label: "Resolved", value: issues.filter(i => i.status === "FINISHED").length },
                    ].map(stat => (
                        <div key={stat.label} style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 26, fontWeight: 800, color: "#0F172A" }}>{stat.value}</div>
                            <div style={{ fontSize: 12, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 2 }}>{stat.label}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Issues grid ───────────────────────────────── */}
            <div id="issues-section" style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px 64px" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 28 }}>
                    <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#0F172A" }}>Recent Reports</h2>
                    {!loading && (
                        <span style={{ fontSize: 13, color: "#9CA3AF" }}>{issues.length} issues</span>
                    )}
                </div>

                {loading && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                        {[1, 2, 3].map(n => (
                            <div key={n} style={{
                                height: 220, background: "#F3F4F6", borderRadius: 16,
                                animation: "pulse 1.5s ease-in-out infinite",
                            }} />
                        ))}
                    </div>
                )}

                {error && (
                    <div style={{
                        background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 12,
                        padding: "14px 18px", color: "#991B1B", fontSize: 14,
                    }}>
                        ⚠️ {error}
                    </div>
                )}

                {!loading && !error && issues.length === 0 && (
                    <div style={{ textAlign: "center", padding: "60px 0", color: "#6B7280" }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>🏙️</div>
                        <p style={{ fontSize: 16 }}>No issues reported yet. Be the first!</p>
                        <button onClick={() => navigate("/report")} style={{
                            marginTop: 12, background: "#3B82F6", color: "#fff",
                            border: "none", borderRadius: 10, padding: "10px 24px",
                            fontSize: 14, fontWeight: 600, cursor: "pointer",
                        }}>
                            Report an Issue
                        </button>
                    </div>
                )}

                {!loading && issues.length > 0 && (
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                        gap: 16,
                    }}>
                        {issues.map(issue => <IssueCard key={issue.id} issue={issue} />)}
                    </div>
                )}
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
        </div>
    );
}