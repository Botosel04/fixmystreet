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

// Removed emojis for a cleaner, professional title
const CATEGORY_NAME = { 1: "Pothole / Road Damage", 2: "Graffiti", 3: "Illegal Dumping", 4: "Broken Streetlight" };

function formatDate(iso) {
    if (!iso) return "Unknown date";
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function formatDateTime(iso) {
    if (!iso) return "Unknown time";
    return new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function IssuePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const userRole = user?.role || localStorage.getItem("role");
    const currentUserEmail = user?.email || localStorage.getItem("email");

    const [issue, setIssue] = useState(null);
    const [comments, setComments] = useState([]);
    const [loadingIssue, setLoadingIssue] = useState(true);
    const [loadingComments, setLoadingComments] = useState(true);
    const [error, setError] = useState("");

    const [commentText, setCommentText] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [commentError, setCommentError] = useState("");

    const [ratingStars, setRatingStars] = useState(0);
    const [hoverStars, setHoverStars] = useState(0);
    const [ratingSubmitted, setRatingSubmitted] = useState(false);
    const [feedbackText, setFeedbackText] = useState("");

    const fetchIssue = () => {
        axios.get(`${API}/api/issues/${id}`)
            .then(res => {
                setIssue(res.data);

                if (res.data.rated === true) {
                    setRatingSubmitted(true);
                }
            })
            .catch(() => setError("Issue not found or failed to load."))
            .finally(() => setLoadingIssue(false));
    };

    useEffect(() => {
        fetchIssue();
        axios.get(`${API}/api/issues/${id}/comments`)
            .then(res => setComments(res.data || []))
            .finally(() => setLoadingComments(false));
    }, [id]);

    const handleRatingSubmit = async() => {
        if(ratingStars == 0) return;
        const token = localStorage.getItem("token");
        try{
            const feedbackParam = feedbackText.trim() ? `&feedback=${encodeURIComponent(feedbackText)}` : "";
            await axios.post(`${API}/api/issues/${id}/rate?stars=${ratingStars}${feedbackParam}`, {}, {
                headers: {Authorization: `Bearer ${token}`}
            });
            setRatingSubmitted(true);
            alert("Thank you for your feedback!");
        }catch(err){
            alert(err?.response?.data || "Failed to submit rating.");
        }
    };

    const handleAddComment = async () => {
        if (!commentText.trim()) return;
        setSubmitting(true);
        setCommentError("");
        const token =localStorage.getItem("token");
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

    const handleWorkerAction = async (actionPath) => {
        setActionLoading(true);
        const token =  localStorage.getItem("token");
        try {
            await axios.patch(`${API}/api/worker/issues/${id}/${actionPath}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchIssue();
        } catch (err) {
            alert(err?.response?.data?.message || `Failed to ${actionPath} task.`);
        } finally {
            setActionLoading(false);
        }
    };

    if (loadingIssue) return (
        <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center", color: "#64748B", fontFamily: "Inter, system-ui, sans-serif" }}>
                <div style={{ fontSize: 40, marginBottom: 12, animation: "pulse 1.5s infinite" }}>⏳</div>
                <p>Loading ticket details…</p>
            </div>
        </div>
    );

    if (error) return (
        <div style={{ maxWidth: 640, margin: "80px auto", textAlign: "center", padding: "0 24px", fontFamily: "Inter, system-ui, sans-serif" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>😕</div>
            <h2 style={{ color: "#0F172A", marginBottom: 8 }}>Ticket Not Found</h2>
            <p style={{ color: "#64748B", marginBottom: 24 }}>{error}</p>
            <button onClick={() => navigate(-1)} style={{
                background: "#3B82F6", color: "#fff", border: "none",
                borderRadius: 8, padding: "10px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer",
            }}>← Go Back</button>
        </div>
    );

    const badge = BADGE_STYLE[issue.status] || BADGE_STYLE.BACKLOG;
    const isWorker = userRole === "CITY_WORKER";

    // Fallback logic for coordinates and maps
    const lat = issue.latitude || issue.location?.latitude;
    const lng = issue.longitude || issue.location?.longitude;
    const osmUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=18/${lat}/${lng}`;

    const locationDisplay = issue.address ? issue.address
        : (issue.location && issue.location.address) ? issue.location.address
            : (lat && lng) ? `${Number(lat).toFixed(5)}, ${Number(lng).toFixed(5)}`
                : "No location provided";

    const title = CATEGORY_NAME[issue.categoryId] || CATEGORY_NAME[issue.category?.id] || "General Task";

    return (
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 24px 80px", fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>

            {/* Back link */}
            <button
                onClick={() => navigate(-1)}
                style={{ background: "none", border: "none", padding: 0, fontSize: 14, fontWeight: 500, color: "#64748B", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 24, transition: "color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.color = "#0F172A"}
                onMouseLeave={e => e.currentTarget.style.color = "#64748B"}
            >
                ← Back to Dashboard
            </button>

            {/* Worker Action Bar */}
            {isWorker && (
                <div style={{ background: "linear-gradient(to right, #F8FAFC, #F1F5F9)", border: "1px solid #E2E8F0", borderRadius: 12, padding: "20px 24px", marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
                    <div>
                        <h4 style={{ margin: "0 0 4px", color: "#0F172A", fontSize: 16, fontWeight: 700 }}>Staff Controls</h4>
                        <p style={{ margin: 0, fontSize: 13, color: "#64748B" }}>Update the status of this ticket to keep citizens informed.</p>
                    </div>

                    <div style={{ display: "flex", gap: 12 }}>
                        {issue.status === "BACKLOG" && (
                            <button onClick={() => handleWorkerAction("claim")} disabled={actionLoading} style={{ background: "#10B981", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: actionLoading ? "wait" : "pointer", boxShadow: "0 2px 4px rgba(16, 185, 129, 0.2)" }}>
                                {actionLoading ? "Processing..." : "✋ Claim Task"}
                            </button>
                        )}
                        {issue.status === "ASSIGNED" && (
                            <button onClick={() => handleWorkerAction("start")} disabled={actionLoading} style={{ background: "#F59E0B", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: actionLoading ? "wait" : "pointer", boxShadow: "0 2px 4px rgba(245, 158, 11, 0.2)" }}>
                                {actionLoading ? "Processing..." : "🚀 Start Work"}
                            </button>
                        )}
                        {issue.status === "IN_PROGRESS" && (
                            <button onClick={() => handleWorkerAction("resolve")} disabled={actionLoading} style={{ background: "#3B82F6", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: actionLoading ? "wait" : "pointer", boxShadow: "0 2px 4px rgba(59, 130, 246, 0.2)" }}>
                                {actionLoading ? "Processing..." : "✅ Mark as Finished"}
                            </button>
                        )}
                        {issue.status === "FINISHED" && (
                            <span style={{ background: "#E2E8F0", color: "#475569", padding: "10px 24px", borderRadius: 8, fontWeight: 600, fontSize: 14 }}>
                                🎉 Task Completed
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Main Issue Card */}
            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, overflow: "hidden", marginBottom: 32, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)" }}>
                {/* Photo Header */}
                {issue.photoUrl && (
                    <div style={{ maxHeight: 400, overflow: "hidden", background: "#F1F5F9", borderBottom: "1px solid #E2E8F0" }}>
                        <img src={issue.photoUrl} alt="Issue" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    </div>
                )}

                <div style={{ padding: "32px" }}>
                    {/* Header Row: Title & Badge */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
                        <div>
                            <h1 style={{ margin: "0 0 8px 0", fontSize: 26, fontWeight: 800, color: "#0F172A", lineHeight: 1.2 }}>
                                {title}
                            </h1>
                            <span style={{ fontSize: 14, color: "#64748B", fontWeight: 500, display: "flex", gap: 8, alignItems: "center" }}>
                                Ticket #{issue.id}
                                <span style={{ color: "#CBD5E1" }}>|</span>
                                Reported by {issue.authorEmail ? issue.authorEmail.split("@")[0] : "Anonymous"}
                            </span>
                        </div>
                        <span style={{
                            fontSize: 13, fontWeight: 700, padding: "6px 16px", borderRadius: 20,
                            background: badge.bg, color: badge.color, letterSpacing: "0.03em",
                        }}>
                            {BADGE_LABEL[issue.status] || issue.status}
                        </span>
                    </div>

                    {/* Description Section */}
                    <div style={{ marginBottom: 32 }}>
                        <h3 style={{ margin: "0 0 8px 0", fontSize: 12, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            Description
                        </h3>
                        <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: "#334155", whiteSpace: "pre-wrap" }}>
                            {issue.description}
                        </p>
                    </div>

                    {/* Clean Meta Details Grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24, borderTop: "1px solid #F1F5F9", paddingTop: 24 }}>

                        {/* Location Data */}
                        <div>
                            <h3 style={{ margin: "0 0 8px 0", fontSize: 12, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Location</h3>
                            <div style={{ fontSize: 15, color: "#0F172A", fontWeight: 500, marginBottom: 8, wordBreak: "break-word" }}>
                                {locationDisplay}
                            </div>
                            {(lat && lng) && (
                                <button
                                    onClick={() => window.open(osmUrl, "_blank", "noopener,noreferrer")}
                                    style={{
                                        background: "#EFF6FF", color: "#2563EB", border: "none",
                                        padding: "6px 12px", borderRadius: 6, fontSize: 13,
                                        fontWeight: 600, cursor: "pointer", transition: "background 0.2s",
                                        display: "inline-flex", alignItems: "center", gap: 6
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = "#DBEAFE"}
                                    onMouseLeave={e => e.currentTarget.style.background = "#EFF6FF"}
                                >
                                    🗺️ View on Map
                                </button>
                            )}
                        </div>

                        {/* Date Data */}
                        <div>
                            <h3 style={{ margin: "0 0 8px 0", fontSize: 12, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Reported On</h3>
                            <div style={{ fontSize: 15, color: "#0F172A", fontWeight: 500 }}>
                                {formatDate(issue.createdAt)}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* ── NEW: Display Existing Feedback (Visible to Workers AND Citizens) ── */}
            {issue.status === "FINISHED" && issue.stars > 0 && (
                <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 16, padding: "28px", marginBottom: 32, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
                        <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            Citizen Feedback
                        </h3>
                        {/* Draw the gold stars dynamically based on the backend data */}
                        <div style={{ display: "flex", gap: 4 }}>
                            {[1, 2, 3, 4, 5].map(star => (
                                <span key={star} style={{ fontSize: 22, color: star <= issue.stars ? "#F59E0B" : "#E2E8F0", lineHeight: 1 }}>
                                    ★
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Only show the text box if the citizen actually wrote something */}
                    {issue.feedback && issue.feedback.trim() !== "" ? (
                        <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderLeft: "4px solid #F59E0B", padding: "16px", borderRadius: "0 8px 8px 0" }}>
                            <p style={{ margin: 0, fontSize: 15, color: "#334155", fontStyle: "italic", lineHeight: 1.6 }}>
                                "{issue.feedback}"
                            </p>
                        </div>
                    ) : (
                        <p style={{ margin: 0, fontSize: 14, color: "#94A3B8", fontStyle: "italic" }}>
                            No written feedback provided.
                        </p>
                    )}
                </div>
            )}
            {/*  Citizen Rating Section */}
            {issue.status === "FINISHED" && !isWorker && !ratingSubmitted && issue.authorEmail == currentUserEmail &&(
                <div style={{ background: "linear-gradient(to right, #F0FDF4, #ECFDF5)", border: "1px solid #A7F3D0", borderRadius: 16, padding: "32px", marginBottom: 32, textAlign: "center", boxShadow: "0 4px 6px -1px rgba(16, 185, 129, 0.1)" }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
                    <h3 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 800, color: "#065F46" }}>This issue has been resolved!</h3>
                    <p style={{ margin: "0 0 24px", color: "#047857", fontSize: 15 }}>How satisfied are you with the city's work on this task?</p>

                    <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 24 }}>
                        {[1, 2, 3, 4, 5].map(star => (
                            <button
                                key={star}
                                onClick={() => setRatingStars(star)}
                                onMouseEnter={() => setHoverStars(star)}
                                onMouseLeave={() => setHoverStars(0)}
                                style={{
                                    background: "none", border: "none", cursor: "pointer",
                                    fontSize: 36, padding: 0, lineHeight: 1,
                                    color: (hoverStars || ratingStars) >= star ? "#F59E0B" : "#D1D5DB",
                                    transition: "color 0.2s, transform 0.1s"
                                }}
                                onMouseDown={e => e.currentTarget.style.transform = "scale(0.9)"}
                                onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                    <div style={{ marginBottom: 24, textAlign: "left" }}>
                        <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#065F46", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            Additional Feedback <span style={{ color: "#047857", fontWeight: 400, textTransform: "none" }}>(Optional)</span>
                        </label>
                        <textarea
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            placeholder="Tell us what the city did well or how they can improve..."
                            rows={3}
                            style={{
                                width: "100%", borderRadius: 10, border: "1px solid #A7F3D0", padding: "14px",
                                fontSize: 14, fontFamily: "inherit", outline: "none", resize: "vertical",
                                boxSizing: "border-box", transition: "border-color 0.2s, box-shadow 0.2s"
                            }}
                            onFocus={e => {
                                e.target.style.borderColor = "#10B981";
                                e.target.style.boxShadow = "0 0 0 3px rgba(16, 185, 129, 0.1)";
                            }}
                            onBlur={e => {
                                e.target.style.borderColor = "#A7F3D0";
                                e.target.style.boxShadow = "none";
                            }}
                        />
                    </div>
                    <button
                        onClick={handleRatingSubmit}
                        disabled={ratingStars === 0}
                        style={{
                            background: ratingStars > 0 ? "#10B981" : "#9CA3AF",
                            color: "#fff", border: "none", borderRadius: 8, padding: "12px 32px",
                            fontSize: 15, fontWeight: 700, cursor: ratingStars > 0 ? "pointer" : "not-allowed",
                            transition: "background 0.2s", boxShadow: ratingStars > 0 ? "0 4px 6px rgba(16, 185, 129, 0.2)" : "none"
                        }}
                    >
                        Submit Feedback
                    </button>
                </div>
            )}

            {/* If they just submitted the rating, show a thank you message */}
            {ratingSubmitted && !isWorker && (
                <div style={{ background: "#F0FDF4", border: "1px solid #A7F3D0", borderRadius: 16, padding: "24px", marginBottom: 32, textAlign: "center" }}>
                    <h3 style={{ margin: 0, color: "#065F46" }}>⭐ Thank you for your feedback!</h3>
                </div>
            )}
            {/* Comments Section */}
            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: "32px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                <h3 style={{ margin: "0 0 24px", fontSize: 18, fontWeight: 800, color: "#0F172A" }}>
                    Comments {!loadingComments && <span style={{ color: "#94A3B8", fontWeight: 500, fontSize: 16 }}>({comments.length})</span>}
                </h3>

                {loadingComments && <p style={{ color: "#94A3B8", fontSize: 14 }}>Loading comments…</p>}

                {!loadingComments && comments.length === 0 && (
                    <div style={{ padding: "32px 0", textAlign: "center", border: "1px dashed #CBD5E1", borderRadius: 12, marginBottom: 24 }}>
                        <p style={{ color: "#64748B", fontSize: 14, margin: 0 }}>No comments yet. Be the first to update this ticket.</p>
                    </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: comments.length ? 32 : 0 }}>
                    {comments.map(c => {
                        const isCommentWorker = c.authorRole === "CITY_WORKER" || c.authorRole === "ADMIN";
                        return (
                            <div key={c.id} style={{
                                background: isCommentWorker ? "#F8FAFC" : "#fff",
                                border: `1px solid ${isCommentWorker ? "#CBD5E1" : "#E2E8F0"}`,
                                borderRadius: 12, padding: "16px 20px",
                                borderLeft: isCommentWorker ? "4px solid #3B82F6" : "1px solid #E2E8F0"
                            }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, gap: 8, flexWrap: "wrap" }}>
                                    <span style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", display: "flex", alignItems: "center", gap: 8 }}>
                                        {c.authorEmail.split("@")[0]}
                                        {isCommentWorker && (
                                            <span style={{ fontSize: 11, background: "#DBEAFE", color: "#1D4ED8", padding: "2px 8px", borderRadius: 12, fontWeight: 700, letterSpacing: "0.02em" }}>
                                                STAFF
                                            </span>
                                        )}
                                    </span>
                                    <span style={{ fontSize: 12, color: "#64748B", fontWeight: 500 }}>{formatDateTime(c.createdAt)}</span>
                                </div>
                                <p style={{ margin: 0, fontSize: 15, color: "#334155", lineHeight: 1.6 }}>{c.text}</p>
                            </div>
                        );
                    })}
                </div>

                {userRole ? (
                    <div>
                        {commentError && (
                            <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "12px 16px", fontSize: 14, color: "#991B1B", marginBottom: 16 }}>
                                {commentError}
                            </div>
                        )}
                        <textarea
                            value={commentText}
                            onChange={e => setCommentText(e.target.value)}
                            placeholder={isWorker ? "Add an official update or note..." : "Add a comment…"}
                            rows={4}
                            style={{
                                width: "100%", borderRadius: 12, border: "1px solid #CBD5E1",
                                padding: "16px", fontSize: 15, resize: "vertical",
                                fontFamily: "inherit", outline: "none", boxSizing: "border-box",
                                transition: "border-color 0.2s, box-shadow 0.2s",
                            }}
                            onFocus={e => {
                                e.target.style.borderColor = "#3B82F6";
                                e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
                            }}
                            onBlur={e => {
                                e.target.style.borderColor = "#CBD5E1";
                                e.target.style.boxShadow = "none";
                            }}
                        />
                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
                            <button
                                onClick={handleAddComment}
                                disabled={submitting || !commentText.trim()}
                                style={{
                                    background: submitting || !commentText.trim() ? "#E2E8F0" : "#0F172A",
                                    color: submitting || !commentText.trim() ? "#94A3B8" : "#fff",
                                    border: "none", borderRadius: 8, padding: "10px 24px",
                                    fontSize: 14, fontWeight: 600, cursor: submitting || !commentText.trim() ? "default" : "pointer",
                                    transition: "background 0.2s",
                                }}
                            >
                                {submitting ? "Posting…" : "Post Comment"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div style={{ textAlign: "center", color: "#64748B", fontSize: 15, padding: "16px 0" }}>
                        <Link to="/login" style={{ color: "#3B82F6", textDecoration: "none", fontWeight: 600 }}>Log in</Link> to leave a comment.
                    </div>
                )}
            </div>
        </div>
    );
}