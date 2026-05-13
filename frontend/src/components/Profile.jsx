import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Profile() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [analytics, setAnalytics] = useState(null);
    const [issues, setIssues] = useState([]);
    const [error, setError] = useState("");

    // helper to get token
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            // Not logged in → redirect to login
            navigate("/login");
            return;
        }

        const source = axios.CancelToken.source();

        async function fetchData() {
            setLoading(true);
            setError("");
            try {
                const headers = { Authorization: `Bearer ${token}` };

                const [aRes, hRes] = await Promise.all([
                    axios.get("http://localhost:8080/api/issues/my-impact", { headers, cancelToken: source.token }),
                    axios.get("http://localhost:8080/api/issues/my-history", { headers, cancelToken: source.token }),
                ]);

                setAnalytics(aRes.data);
                setIssues(hRes.data || []);
            } catch (err) {
                if (!axios.isCancel(err)) {
                    setError(
                        err?.response?.data?.message ||
                        (err?.response?.data ? JSON.stringify(err.response.data) : err.message) ||
                        "Failed to load profile data"
                    );
                }
            } finally {
                setLoading(false);
            }
        }

        fetchData();

        return () => source.cancel();
    }, [navigate, token]);

    if (!token) return null; // redirect will happen in useEffect

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>My profile & statistics</h2>
            </div>

            {loading && <div className="alert alert-info">Loading your profile…</div>}
            {error && <div className="alert alert-danger">Error: {error}</div>}

            {!loading && analytics && (
                <div className="row mb-4">
                    <div className="col-md-4">
                        <div className="card text-center shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title">Reported</h5>
                                <p className="display-6">{analytics.totalReported}</p>
                                <p className="text-muted small">Total reports you created</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card text-center shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title">Resolved</h5>
                                <p className="display-6">{analytics.totalResolved}</p>
                                <p className="text-muted small">Total resolved issues</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card text-center shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title">Resolution rate</h5>
                                <p className="display-6">{analytics.resolutionRate}%</p>
                                <p className="text-muted small">Resolution rate</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="card shadow-sm">
                <div className="card-body">
                    <h5 className="card-title">My reported issues</h5>
                    {loading && <p>Loading issues…</p>}
                    {!loading && issues.length === 0 && <p className="text-muted">You have not reported any issues yet.</p>}
                    {!loading && issues.length > 0 && (
                        <div className="list-group">
                            {issues.map((issue) => (
                                <Link
                                    to={`/issues/${issue.id}`}
                                    className="list-group-item list-group-item-action d-flex justify-content-between align-items-start"
                                    key={issue.id}
                                >
                                    <div>
                                        <div className="fw-bold">{issue.description || "No description"}</div>
                                        <small className="text-muted">{issue.address || (issue.latitude ? `${issue.latitude}, ${issue.longitude}` : "")}</small>
                                    </div>
                                    <div className="text-end">
                                        <div className="badge bg-secondary">{issue.status}</div>
                                        <div className="small text-muted">{new Date(issue.createdAt).toLocaleString()}</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}