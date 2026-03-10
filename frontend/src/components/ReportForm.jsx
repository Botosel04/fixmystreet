import { useState } from 'react';
import axios from 'axios';
export default function ReportForm() {
    const [formData, setFormData] = useState({
        issueType: "POTHOLE",
        description: "",
        address: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            const response = await axios.post("http://localhost:8080/api/issues/report", formData);
            console.log(response.data);
            alert("Report Submitted Successfully");
            setFormData({issueType: "POTHOLE", description: "", address: ""})
        }catch(err){
            console.log(err);
        }
    }
    return(
        <div className="container mt-5" style={{ maxWidth: '600px' }}>
            <div className="card shadow p-4">
                <h2 className="mb-4 text-center text-primary">Report a New Issue</h2>

                <form onSubmit={handleSubmit}>

                    <div className="mb-3">
                        <label className="form-label fw-bold">Issue Type</label>
                        <select
                            className="form-select"
                            name="issueType"
                            value={formData.issueType}
                            onChange={handleChange}
                        >
                            <option value="POTHOLE">Pothole / Road Damage</option>
                            <option value="GRAFFITI">Graffiti</option>
                            <option value="TRASH">Illegal Dumping</option>
                            <option value="STREETLIGHT">Broken Streetlight</option>
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