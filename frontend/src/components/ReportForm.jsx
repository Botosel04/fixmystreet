import { useState } from 'react';
import axios from 'axios';

const CATEGORY_OPTIONS = [
    { id: 1, label: 'Pothole / Road Damage' },
    { id: 2, label: 'Graffiti' },
    { id: 3, label: 'Illegal Dumping' },
    { id: 4, label: 'Broken Streetlight' }
];

export default function ReportForm() {
    const [formData, setFormData] = useState({
        categoryId: 1,
        description: '',
        address: '',
        latitude: '',
        longitude: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        const payload = {
            categoryId: Number(formData.categoryId),
            description: formData.description,
            address: formData.address
        };

        if (formData.latitude !== '' && formData.longitude !== '') {
            payload.latitude = Number(formData.latitude);
            payload.longitude = Number(formData.longitude);
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:8080/api/issues/report',
                payload,
                token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
            );

            console.log(response.data);
            setMessage('Report submitted successfully');
            setFormData({ categoryId: 1, description: '', address: '', latitude: '', longitude: '' });
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to submit report');
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '600px' }}>
            <div className="card shadow p-4">
                <h2 className="mb-4 text-center text-primary">Report a New Issue</h2>

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
                        >
                            {CATEGORY_OPTIONS.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-bold">Nearest Address</label>
                        <input
                            type="text"
                            className="form-control"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="e.g. 123 Main St"
                            required
                        />
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-bold">Latitude (optional)</label>
                            <input
                                type="number"
                                step="any"
                                className="form-control"
                                name="latitude"
                                value={formData.latitude}
                                onChange={handleChange}
                                placeholder="e.g. 52.2297"
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-bold">Longitude (optional)</label>
                            <input
                                type="number"
                                step="any"
                                className="form-control"
                                name="longitude"
                                value={formData.longitude}
                                onChange={handleChange}
                                placeholder="e.g. 21.0122"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-bold">Description</label>
                        <textarea
                            className="form-control"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Please describe the issue in detail..."
                            rows="4"
                            required
                        />
                    </div>

                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary btn-lg">
                            Submit Report
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}