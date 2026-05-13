import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../auth/AuthProvider";

const CATEGORIES = [
    { id: 1, label: "Pothole / Road Damage", icon: "🕳️" },
    { id: 2, label: "Graffiti",               icon: "🖊️" },
    { id: 3, label: "Illegal Dumping",         icon: "🗑️" },
    { id: 4, label: "Broken Streetlight",      icon: "💡" },
];

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
    const [dragOver, setDragOver] = useState(false);

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            latitude: latitude || null,
            longitude: longitude || null,
        }));
    }, [latitude, longitude]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: name === "categoryId" ? parseInt(value) : value });
    };

    const processPhoto = (file) => {
        if (!file || !file.type.startsWith("image/")) return;
        setPhotoFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setPhotoPreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handlePhotoChange = (e) => processPhoto(e.target.files?.[0]);

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        processPhoto(e.dataTransfer.files?.[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(""); setError(""); setLoading(true);

        if (!formData.description.trim()) {
            setError("Please describe the issue."); setLoading(false); return;
        }
        if (!formData.address.trim() && (!formData.latitude || !formData.longitude)) {
            setError("Provide an address or pin a location on the map."); setLoading(false); return;
        }

        try {
            const payload = {
                categoryId: formData.categoryId,
                description: formData.description,
                address: formData.address || "",
                latitude: formData.latitude,
                longitude: formData.longitude,
                photoUrl: photoPreview || null,
            };
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            await axios.post("http://localhost:8080/api/issues/report", payload, { headers });

            setMessage("Report submitted — thank you for making the city better.");
            setFormData({ categoryId: 1, address: "", description: "", latitude: null, longitude: null });
            setPhotoFile(null); setPhotoPreview("");
            setTimeout(() => { if (user) window.location.href = "/profile"; }, 2000);
        } catch (err) {
            const msg = err?.response?.data?.message || err?.response?.data || "Failed to submit report.";
            setError(typeof msg === "string" ? msg : JSON.stringify(msg));
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap');

                .rf-wrap * { box-sizing: border-box; }

                .rf-wrap {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    font-family: 'DM Sans', sans-serif;
                    background: #FFFFFF;
                    color: #111827;
                    border-radius: 0;
                }

                .rf-header {
                    padding: 28px 28px 20px;
                    border-bottom: 1px solid #F0F0EE;
                }

                .rf-eyebrow {
                    font-size: 10px;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    color: #16A35A;
                    margin-bottom: 6px;
                }

                .rf-title {
                    font-family: 'DM Serif Display', serif;
                    font-size: 24px;
                    color: #111827;
                    margin: 0;
                    line-height: 1.2;
                }

                .rf-body {
                    flex: 1;
                    overflow-y: auto;
                    padding: 24px 28px 28px;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    scrollbar-width: thin;
                    scrollbar-color: #E5E7EB transparent;
                }

                .rf-field { display: flex; flex-direction: column; gap: 8px; }

                .rf-label {
                    font-size: 11px;
                    font-weight: 600;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: #9CA3AF;
                }

                .rf-input, .rf-textarea {
                    background: #F9FAFB;
                    border: 1px solid #E5E7EB;
                    border-radius: 10px;
                    color: #111827;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 14px;
                    padding: 12px 14px;
                    outline: none;
                    transition: border-color 0.2s, background 0.2s;
                    width: 100%;
                }
                .rf-input:focus, .rf-textarea:focus {
                    border-color: #16A35A;
                    background: #fff;
                }
                .rf-input::placeholder, .rf-textarea::placeholder { color: #C4C9D4; }
                .rf-textarea { resize: vertical; min-height: 90px; line-height: 1.6; }

                /* Category pills */
                .rf-categories {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 8px;
                }
                .rf-cat-pill {
                    background: #F9FAFB;
                    border: 1px solid #E5E7EB;
                    border-radius: 10px;
                    padding: 10px 12px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                    transition: border-color 0.2s, background 0.2s;
                    font-size: 13px;
                    color: #6B7280;
                    font-family: 'DM Sans', sans-serif;
                    text-align: left;
                    line-height: 1.3;
                }
                .rf-cat-pill:hover { border-color: #D1D5DB; color: #374151; }
                .rf-cat-pill.active {
                    border-color: #16A35A;
                    background: #F0FDF4;
                    color: #15803D;
                }
                .rf-cat-icon { font-size: 18px; flex-shrink: 0; }

                /* Coordinates pill */
                .rf-coords {
                    background: #F0FDF4;
                    border: 1px solid #BBF7D0;
                    border-radius: 10px;
                    padding: 12px 14px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 13px;
                    color: #15803D;
                }
                .rf-coords-hint {
                    background: #F9FAFB;
                    border: 1px dashed #D1D5DB;
                    border-radius: 10px;
                    padding: 12px 14px;
                    font-size: 13px;
                    color: #9CA3AF;
                    text-align: center;
                }

                /* Photo drop zone */
                .rf-dropzone {
                    background: #F9FAFB;
                    border: 1.5px dashed #D1D5DB;
                    border-radius: 12px;
                    padding: 20px;
                    text-align: center;
                    cursor: pointer;
                    transition: border-color 0.2s, background 0.2s;
                    position: relative;
                }
                .rf-dropzone.drag { border-color: #16A35A; background: #F0FDF4; }
                .rf-dropzone:hover { border-color: #9CA3AF; }
                .rf-dropzone input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
                .rf-dz-icon { font-size: 28px; margin-bottom: 6px; }
                .rf-dz-text { font-size: 13px; color: #6B7280; }
                .rf-dz-sub { font-size: 11px; color: #9CA3AF; margin-top: 3px; }

                .rf-preview {
                    position: relative;
                    border-radius: 10px;
                    overflow: hidden;
                    border: 1px solid #E5E7EB;
                }
                .rf-preview img { width: 100%; max-height: 140px; object-fit: cover; display: block; }
                .rf-preview-remove {
                    position: absolute;
                    top: 8px; right: 8px;
                    background: rgba(0,0,0,0.55);
                    color: #fff;
                    border: none;
                    border-radius: 50%;
                    width: 26px; height: 26px;
                    cursor: pointer;
                    font-size: 14px;
                    display: flex; align-items: center; justify-content: center;
                }

                /* Alerts */
                .rf-alert {
                    border-radius: 10px;
                    padding: 12px 14px;
                    font-size: 13px;
                    line-height: 1.5;
                }
                .rf-alert.success { background: #F0FDF4; border: 1px solid #BBF7D0; color: #15803D; }
                .rf-alert.error   { background: #FEF2F2; border: 1px solid #FECACA; color: #B91C1C; }

                /* Submit button */
                .rf-submit {
                    background: #16A35A;
                    color: #fff;
                    border: none;
                    border-radius: 12px;
                    padding: 14px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 14px;
                    font-weight: 700;
                    letter-spacing: 0.03em;
                    cursor: pointer;
                    width: 100%;
                    transition: opacity 0.2s, transform 0.15s;
                    margin-top: 4px;
                }
                .rf-submit:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
                .rf-submit:disabled { opacity: 0.35; cursor: default; transform: none; }

                .rf-divider {
                    height: 1px;
                    background: #F3F4F6;
                    margin: 0 -28px;
                }
            `}</style>

            <div className="rf-wrap">
                {/* Header */}
                <div className="rf-header">
                    <div className="rf-eyebrow">Fix My Street</div>
                    <h2 className="rf-title">Report an Issue</h2>
                </div>

                <div className="rf-body">
                    {message && <div className="rf-alert success">✓ {message}</div>}
                    {error   && <div className="rf-alert error">⚠ {error}</div>}

                    {/* Category */}
                    <div className="rf-field">
                        <span className="rf-label">Category</span>
                        <div className="rf-categories">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    className={`rf-cat-pill${formData.categoryId === cat.id ? " active" : ""}`}
                                    onClick={() => setFormData({ ...formData, categoryId: cat.id })}
                                    disabled={loading}
                                >
                                    <span className="rf-cat-icon">{cat.icon}</span>
                                    <span>{cat.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="rf-divider" />

                    {/* Description */}
                    <div className="rf-field">
                        <label className="rf-label">Description <span style={{ color: "#16A35A" }}>*</span></label>
                        <textarea
                            className="rf-textarea"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="What did you observe? Be as specific as possible."
                            disabled={loading}
                        />
                    </div>

                    {/* Address */}
                    <div className="rf-field">
                        <label className="rf-label">Address</label>
                        <input
                            type="text"
                            className="rf-input"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Street address (or pin on the map)"
                            disabled={loading}
                        />
                    </div>

                    {/* Coordinates */}
                    <div className="rf-field">
                        <span className="rf-label">Coordinates</span>
                        {formData.latitude && formData.longitude ? (
                            <div className="rf-coords">
                                <span style={{ fontSize: 18 }}>📍</span>
                                <span>
                                    {Number(formData.latitude).toFixed(5)}, {Number(formData.longitude).toFixed(5)}
                                </span>
                            </div>
                        ) : (
                            <div className="rf-coords-hint">Click on the map to pin a location</div>
                        )}
                    </div>

                    {/* Photo */}
                    <div className="rf-field">
                        <span className="rf-label">Photo <span style={{ color: "#C4C9D4", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>— optional</span></span>
                        {photoPreview ? (
                            <div className="rf-preview">
                                <img src={photoPreview} alt="Preview" />
                                <button className="rf-preview-remove" onClick={() => { setPhotoFile(null); setPhotoPreview(""); }}>✕</button>
                            </div>
                        ) : (
                            <div
                                className={`rf-dropzone${dragOver ? " drag" : ""}`}
                                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={handleDrop}
                            >
                                <input type="file" accept="image/*" onChange={handlePhotoChange} disabled={loading} />
                                <div className="rf-dz-icon">📷</div>
                                <div className="rf-dz-text">Drop a photo or click to browse</div>
                                <div className="rf-dz-sub">JPG, PNG, WEBP</div>
                            </div>
                        )}
                    </div>

                    {/* Submit */}
                    <button className="rf-submit" onClick={handleSubmit} disabled={loading}>
                        {loading ? "Submitting…" : "Submit Report →"}
                    </button>
                </div>
            </div>
        </>
    );
}