import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
// --- MAP IMPORTS ---
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// --- BULLETPROOF VITE FIX (From your MapComponent) ---
const customIcon = L.icon({
    iconUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNSIgaGVpZ2h0PSI0MSIgdmlld0JveD0iMCAwIDI1IDQxIj48cGF0aCBmaWxsPSIjM0I4N0YzIiBkPSJNMTIuNSAwQzUuNiAwIDAgNS42IDAgMTIuNWMwIDcuNSAxMi41IDI4LjEgMTIuNSAyOC4xczEyLjUtMjAuNiAxMi41LTI4LjFDMjUgNS42IDE5LjQgMCAxMi41IDB6bTAgMTYuN2MtMi4zIDAtNC4yLTEuOS00LjItNC4yYzAtMi4zIDEuOS00LjIgNC4yLTQuMnM0LjIgMS45IDQuMiA0LjJjMCAyLjMtMS45IDQuMi00LjIgNC4yeiIvPjwvc3ZnPg==",
    shadowUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MSIgaGVpZ2h0PSI0MSIgdmlld0JveD0iMCAwIDQxIDQxIj48ZWxsaXBzZSBjeD0iMjAuNSIgY3k9IjM4IiByeD0iMjAuNSIgcnk9IjMiIGZpbGw9IiMwMDAwMDAiIG9wYWNpdHk9IjAuMyIvPjwvc3ZnPg==",
    iconSize: [25, 41],
    shadowSize: [41, 41],
    iconAnchor: [12, 41],
    shadowAnchor: [12, 41],
    popupAnchor: [1, -34],
});
// ----------------------------------------------------
// --------------------------------------------
const API = "http://localhost:8080";

const BADGE_STYLE = {
    BACKLOG:     { bg: "#E8F0FE", color: "#1A56DB" },
    ASSIGNED:    { bg: "#FEF3C7", color: "#92400E" },
    IN_PROGRESS: { bg: "#D1FAE5", color: "#065F46" },
    FINISHED:    { bg: "#F3F4F6", color: "#374151" },
    ON_HOLD:     { bg: "#FEE2E2", color: "#991B1B" },
};

const BADGE_LABEL = {
    BACKLOG: "Backlog", ASSIGNED: "Assigned", IN_PROGRESS: "In progress",
    FINISHED: "Finished", ON_HOLD: "On hold",
};

const CATEGORY_NAME = {
    1: "Pothole / Road Damage", 2: "Graffiti", 3: "Illegal Dumping", 4: "Broken Streetlight"
};

function locationText(issue) {
    if (issue.address) return issue.address;
    if (issue.location && issue.location.address) return issue.location.address;
    if (issue.latitude && issue.longitude) return `${Number(issue.latitude).toFixed(5)}, ${Number(issue.longitude).toFixed(5)}`;
    if (issue.location?.latitude && issue.location?.longitude) return `${Number(issue.location.latitude).toFixed(5)}, ${Number(issue.location.longitude).toFixed(5)}`;
    return "Location unknown";
}

function formatDate(iso) {
    if (!iso) return "Unknown date";
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// ── Component: Issue Card (List View) ──
function IssueCard({ issue }) {
    const badge = BADGE_STYLE[issue.status] || BADGE_STYLE.BACKLOG;
    const title = CATEGORY_NAME[issue.categoryId] || CATEGORY_NAME[issue.category?.id] || "General Task";
    const [imgError, setImgError] = useState(false);

    const lat = issue.latitude || issue.location?.latitude;
    const lng = issue.longitude || issue.location?.longitude;
    const osmUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=18/${lat}/${lng}`;

    return (
        <Link to={`/issues/${issue.id}`} style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{
                background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, overflow: "hidden",
                display: "flex", flexDirection: "column", transition: "box-shadow 0.2s ease, transform 0.2s ease",
                cursor: "pointer", height: "100%",
            }}
                 onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.10)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                 onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
                {issue.photoUrl && !imgError && (
                    <div style={{ height: 160, overflow: "hidden", background: "#F3F4F6" }}>
                        <img src={issue.photoUrl} alt="Issue photo" onError={() => setImgError(true)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                )}

                <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0F172A", lineHeight: 1.3 }}>{title}</h3>
                            <span style={{ fontSize: 12, color: "#64748B", fontFamily: "monospace" }}>Issue #{issue.id}</span>
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 20, background: badge.bg, color: badge.color, whiteSpace: "nowrap" }}>
                            {BADGE_LABEL[issue.status] || issue.status}
                        </span>
                    </div>

                    <p style={{ fontSize: 14, margin: 0, lineHeight: 1.55, color: "#334155", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {issue.description}
                    </p>

                    <div style={{ marginTop: "auto", borderTop: "1px solid #F1F5F9", paddingTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: 12, color: "#6B7280", display: "flex", alignItems: "center", gap: 6, overflow: "hidden" }}>
                                <span style={{ color: "#EF4444" }}>📍</span>
                                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{locationText(issue)}</span>
                            </span>
                            {(lat && lng) && (
                                <button
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(osmUrl, "_blank", "noopener,noreferrer"); }}
                                    style={{ background: "#F1F5F9", color: "#0F172A", border: "1px solid #CBD5E1", padding: "4px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer", transition: "background 0.2s" }}
                                    onMouseEnter={e => e.currentTarget.style.background = "#E2E8F0"} onMouseLeave={e => e.currentTarget.style.background = "#F1F5F9"}
                                >
                                    🗺️ Maps
                                </button>
                            )}
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: 12, color: "#6B7280" }}>🗓 {formatDate(issue.createdAt)}</span>
                            <span style={{ fontSize: 12, fontWeight: 600, color: "#3B82F6" }}>Manage Task →</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

// ── Main Component: Worker Dashboard ──
export default function WorkerDashboard() {
    const [allIssues, setAllIssues] = useState([]);
    const [filteredBacklog, setFilteredBacklog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("BACKLOG");

    // --- NEW: View Mode State ---
    const [viewMode, setViewMode] = useState("LIST"); // 'LIST' or 'MAP'

    const [showFilters, setShowFilters] = useState(false);
    const [lat, setLat] = useState("");
    const [lng, setLng] = useState("");
    const [radiusKm, setRadiusKm] = useState(5);
    const [categoryId, setCategoryId] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [locationLoading, setLocationLoading] = useState(false);

    const navigate = useNavigate();
    const workerEmail = localStorage.getItem("email");

    useEffect(() => {
        const token = localStorage.getItem("token") || localStorage.getItem("jwt_token");
        if (!token) { navigate("/login"); return; }

        axios.get(`${API}/api/issues/all`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => setAllIssues(res.data || []))
            .catch(err => setError(err?.response?.data?.message || "Failed to load tasks"))
            .finally(() => setLoading(false));
    }, [navigate]);

    const handleGetLocation = () => {
        if (!navigator.geolocation) { alert("Geolocation not supported."); return; }
        setLocationLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLat(position.coords.latitude);
                setLng(position.coords.longitude);
                setLocationLoading(false);
            },
            () => { alert("Unable to retrieve location."); setLocationLoading(false); }
        );
    };

    const applyFilters = async () => {
        if (!lat || !lng) { alert("Latitude and Longitude are required to search nearby tasks."); return; }
        setLoading(true); setError("");
        try {
            const token = localStorage.getItem("token") || localStorage.getItem("jwt_token");
            const params = new URLSearchParams();
            params.append("lat", lat); params.append("lng", lng); params.append("radiusKm", radiusKm);
            if (categoryId) params.append("categoryId", categoryId);
            if (fromDate) params.append("from", fromDate);
            if (toDate) params.append("to", toDate);

            const res = await axios.get(`${API}/api/worker/backlog/nearby?${params.toString()}`, { headers: { Authorization: `Bearer ${token}` } });
            setFilteredBacklog(res.data);
            setShowFilters(false);
        } catch (err) { setError("Failed to apply filters."); } finally { setLoading(false); }
    };

    const clearFilters = () => {
        setFilteredBacklog(null);
        setLat(""); setLng(""); setCategoryId(""); setFromDate(""); setToDate(""); setRadiusKm(5);
        setShowFilters(false);
    };

    const baseBacklog = allIssues.filter(i => i.status === "BACKLOG");
    const displayBacklog = filteredBacklog !== null ? filteredBacklog : baseBacklog;
    const myActiveTasks = allIssues.filter(i => (i.status === "ASSIGNED" || i.status === "IN_PROGRESS") && (i.assignedWorkerEmail === workerEmail || i.assignedWorker?.email === workerEmail));
    const displayedIssues = activeTab === "BACKLOG" ? displayBacklog : myActiveTasks;

    // Default map center (Cluj-Napoca)
    const mapCenter = (lat && lng) ? [parseFloat(lat), parseFloat(lng)] : [46.770439, 23.591423];

    return (
        <div style={{ textAlign: "left", fontFamily: "system-ui, sans-serif", minHeight: "100vh", background: "#F8FAFC" }}>
            {/* Hero */}
            <div style={{ background: "linear-gradient(135deg, #0F172A 0%, #064E3B 100%)", color: "#fff", padding: "40px 24px", textAlign: "center" }}>
                <h1 style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)", fontWeight: 800, margin: 0 }}>City Maintenance Dashboard</h1>
            </div>

            {/* Navigation Strip */}
            <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
                <div style={{ display: "flex", gap: 10, padding: "16px 0" }}>
                    <button onClick={() => setActiveTab("BACKLOG")} style={{ padding: "10px 20px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", border: "none", background: activeTab === "BACKLOG" ? "#EFF6FF" : "transparent", color: activeTab === "BACKLOG" ? "#1D4ED8" : "#6B7280" }}>
                        📋 City Backlog ({displayBacklog.length})
                    </button>
                    <button onClick={() => setActiveTab("MY_TASKS")} style={{ padding: "10px 20px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", border: "none", background: activeTab === "MY_TASKS" ? "#ECFDF5" : "transparent", color: activeTab === "MY_TASKS" ? "#047857" : "#6B7280" }}>
                        🛠️ My Active Tasks ({myActiveTasks.length})
                    </button>
                </div>

                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    {/* ── NEW: Map/List Toggle ── */}
                    <div style={{ display: "flex", background: "#F1F5F9", borderRadius: 8, padding: 4 }}>
                        <button onClick={() => setViewMode("LIST")} style={{ padding: "6px 16px", borderRadius: 6, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: viewMode === "LIST" ? "#fff" : "transparent", color: viewMode === "LIST" ? "#0F172A" : "#64748B", boxShadow: viewMode === "LIST" ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}>
                            📋 List
                        </button>
                        <button onClick={() => setViewMode("MAP")} style={{ padding: "6px 16px", borderRadius: 6, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: viewMode === "MAP" ? "#fff" : "transparent", color: viewMode === "MAP" ? "#0F172A" : "#64748B", boxShadow: viewMode === "MAP" ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}>
                            🗺️ Map
                        </button>
                    </div>

                    {activeTab === "BACKLOG" && (
                        <button onClick={() => setShowFilters(!showFilters)} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #CBD5E1", background: "#fff", cursor: "pointer", fontWeight: 600, color: "#334155" }}>
                            {showFilters ? "Close Filters ✖" : "Advanced Filters 🔍"}
                        </button>
                    )}
                </div>
            </div>

            {/* Filter Panel (Hidden if closed) */}
            {activeTab === "BACKLOG" && showFilters && (
                <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, gridColumn: "1 / -1" }}>
                        <label style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>Location & Radius</label>
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                            <button onClick={handleGetLocation} disabled={locationLoading} style={{ background: locationLoading ? "#94A3B8" : "#3B82F6", color: "#fff", border: "none", padding: "10px 16px", borderRadius: 8, cursor: locationLoading ? "wait" : "pointer", fontWeight: 600, transition: "background 0.2s" }}>
                                {locationLoading ? "⏳ Locating..." : "📍 Use My Location"}
                            </button>
                            <input type="number" placeholder="Lat" value={lat} onChange={e => setLat(e.target.value)} style={{ padding: "10px", borderRadius: 8, border: "1px solid #CBD5E1", width: "100px" }} />
                            <input type="number" placeholder="Lng" value={lng} onChange={e => setLng(e.target.value)} style={{ padding: "10px", borderRadius: 8, border: "1px solid #CBD5E1", width: "100px" }} />
                            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 10px" }}>
                                <span style={{ fontSize: 14 }}>Radius: {radiusKm}km</span>
                                <input type="range" min="1" max="50" value={radiusKm} onChange={e => setRadiusKm(e.target.value)} />
                            </div>
                        </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <label style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>Category</label>
                        <select value={categoryId} onChange={e => setCategoryId(e.target.value)} style={{ padding: "10px", borderRadius: 8, border: "1px solid #CBD5E1" }}>
                            <option value="">All Categories</option>
                            <option value="1">Pothole / Road Damage</option>
                            <option value="2">Graffiti</option>
                            <option value="3">Illegal Dumping</option>
                            <option value="4">Broken Streetlight</option>
                        </select>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <label style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>From Date</label>
                        <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} style={{ padding: "10px", borderRadius: 8, border: "1px solid #CBD5E1" }} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <label style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>To Date</label>
                        <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} style={{ padding: "10px", borderRadius: 8, border: "1px solid #CBD5E1" }} />
                    </div>

                    <div style={{ gridColumn: "1 / -1", display: "flex", gap: 10, marginTop: 10 }}>
                        <button onClick={applyFilters} style={{ background: "#10B981", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>Apply Filters</button>
                        <button onClick={clearFilters} style={{ background: "#F1F5F9", color: "#475569", border: "1px solid #CBD5E1", padding: "10px 24px", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>Clear Filters</button>
                    </div>
                </div>
            )}

            {/* ── Main Content Area ── */}
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px 64px" }}>
                {loading && <div style={{ color: "#64748B" }}>⏳ Loading tasks...</div>}
                {error && <div style={{ background: "#FEF2F2", color: "#991B1B", padding: "12px", borderRadius: 8 }}>⚠️ {error}</div>}

                {!loading && !error && (
                    <>
                        {/* VIEW MODE: MAP */}
                        {viewMode === "MAP" && (
                            <div style={{ height: "600px", width: "100%", borderRadius: "16px", overflow: "hidden", border: "1px solid #CBD5E1", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}>
                                <MapContainer center={mapCenter} zoom={13} style={{ height: "100%", width: "100%" }}>
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />

                                    {/* Draw pins for every issue that has coordinates */}
                                    {displayedIssues.map((issue) => {
                                        const issueLat = issue.latitude || issue.location?.latitude;
                                        const issueLng = issue.longitude || issue.location?.longitude;
                                        const title = CATEGORY_NAME[issue.categoryId] || CATEGORY_NAME[issue.category?.id] || "Task";

                                        if (!issueLat || !issueLng) return null; // Skip issues with no location

                                        return (
                                            <Marker key={issue.id} position={[issueLat, issueLng]}>
                                                <Popup>
                                                    <div style={{ fontFamily: "system-ui", minWidth: "150px" }}>
                                                        <h4 style={{ margin: "0 0 5px", fontSize: "14px" }}>{title}</h4>
                                                        <span style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "12px", background: "#EFF6FF", color: "#1D4ED8" }}>
                                                            {BADGE_LABEL[issue.status]}
                                                        </span>
                                                        <p style={{ margin: "10px 0", fontSize: "12px", color: "#475569" }}>{formatDate(issue.createdAt)}</p>
                                                        <Link to={`/issues/${issue.id}`} style={{ display: "block", textAlign: "center", background: "#3B82F6", color: "#fff", textDecoration: "none", padding: "6px", borderRadius: "6px", fontSize: "12px", fontWeight: "bold" }}>
                                                            Manage Task
                                                        </Link>
                                                    </div>
                                                </Popup>
                                            </Marker>
                                        );
                                    })}
                                </MapContainer>
                            </div>
                        )}

                        {/* VIEW MODE: LIST */}
                        {viewMode === "LIST" && (
                            displayedIssues.length === 0 ? (
                                <div style={{ textAlign: "center", padding: "60px 20px", color: "#64748B", background: "#fff", borderRadius: 12, border: "1px dashed #CBD5E1" }}>
                                    <div style={{ fontSize: 40, marginBottom: 10 }}>🔍</div>
                                    <p style={{ margin: 0, fontWeight: 500 }}>No tasks found for your current criteria.</p>
                                </div>
                            ) : (
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                                    {displayedIssues.map(issue => <IssueCard key={issue.id} issue={issue} />)}
                                </div>
                            )
                        )}
                    </>
                )}
            </div>
        </div>
    );
}