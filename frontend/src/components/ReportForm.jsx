import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../auth/AuthProvider";

export default function ReportForm({ latitude, longitude, onLocationSelect }) {
    const { user } = useContext(AuthContext);
    const token = localStorage.getItem("token");

    const [formData, setFormData] = useState({
        categoryId: 1,
        address: "",
        description: "",
        latitude: latitude || null,
        longitude: longitude || null,
    });

    const [photoFile, setPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Sync props to form state when map coordinates change
    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            latitude: latitude || null,
            longitude: longitude || null,
        }));
    }, [latitude, longitude]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: name === "categoryId" ? parseInt(value) : value });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setPhotoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setLoading(true);

        if (!formData.description.trim()) {
            setError("Please describe the issue");
            setLoading(false);
            return;
        }

        if (!formData.address.trim() && (!formData.latitude || !formData.longitude)) {
            setError("Please provide an address or select a location on the map");
            setLoading(false);
            return;
        }

        try {
            const payload = {
                categoryId: formData.categoryId,
                description: formData.description,
                address: formData.address || "",
                latitude: formData.latitude,
                longitude: formData.longitude,
                photoUrl: photoPreview || null, // base64 photo or null
            };

            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            const response = await axios.post("http://localhost:8080/api/issues/report", payload, { headers });

            setMessage("Issue reported successfully! Thank you for helping keep our city clean.");
            setFormData({
                categoryId: 1,
                address: "",
                description: "",
                latitude: null,
                longitude: null,
            });
            setPhotoFile(null);
            setPhotoPreview("");

            setTimeout(() => {
                if (user) {
                    window.location.href = "/profile";
                }
            }, 2000);
        } catch (err) {
            const errorMsg = err?.response?.data?.message || err?.response?.data || "Failed to report issue";
            setError(typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <div style={{ backgroundColor: "#28a745", color: "white", padding: "15px", borderRadius: "8px 8px 0 0" }}>
                <h5 style={{ margin: 0 }}>Report an Issue</h5>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
                {message && <div className="alert alert-success">{message}</div>}
                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Issue Category</label>
                        <select
                            className="form-select"
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                            disabled={loading}
                        >
                            <option value={1}>Pothole / Road Damage</option>
                            <option value={2}>Graffiti</option>
                            <option value={3}>Illegal Dumping</option>
                            <option value={4}>Broken Streetlight</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-bold">Description *</label>
                        <textarea
                            className="form-control"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe the issue in detail"
                            rows="3"
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-bold">Address</label>
                        <input
                            type="text"
                            className="form-control"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Street address (or use map)"
                            disabled={loading}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-bold">Coordinates</label>
                        {formData.latitude && formData.longitude ? (
                            <div className="alert alert-info" style={{ marginBottom: 0 }}>
                                <p className="mb-1" style={{ fontSize: "0.9rem" }}>
                                    <strong>Lat:</strong> {formData.latitude.toFixed(6)}
                                </p>
                                <p style={{ fontSize: "0.9rem", marginBottom: 0 }}>
                                    <strong>Lng:</strong> {formData.longitude.toFixed(6)}
                                </p>
                            </div>
                        ) : (
                            <p className="text-muted small">Click on the map to set coordinates</p>
                        )}
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-bold">Photo (optional)</label>
                        <input
                            type="file"
                            className="form-control"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            disabled={loading}
                        />
                        {photoPreview && (
                            <div style={{ marginTop: "10px" }}>
                                <img
                                    src={photoPreview}
                                    alt="Preview"
                                    style={{ maxWidth: "100%", maxHeight: "150px", borderRadius: "4px" }}
                                />
                            </div>
                        )}
                    </div>

                    <div className="d-grid">
                        <button type="submit" className="btn btn-success btn-lg" disabled={loading}>
                            {loading ? "Submitting..." : "Report Issue"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}