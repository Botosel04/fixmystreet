import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function RegisterForm(){
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        userName: "",
        confirmPassword: "",
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }
    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setLoading(true);

        if(!formData.userName.trim()){
            setError("Please enter username");
            setLoading(false);
            return
        }
        if (formData.userName.length < 3) {
            setError("Username must be at least 3 characters");
            setLoading(false);
            return;
        }
        if (!formData.email.trim()) {
            setError("Email is required");
            setLoading(false);
            return;
        }
        if (!formData.password) {
            setError("Password is required");
            setLoading(false);
            return;
        }
        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            setLoading(false);
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }
        try{
            const payload = {
                email: formData.email,
                password: formData.password,
                userName: formData.userName,
            };
            const response = await axios.post("http://localhost:8080/api/auth/register", payload);
            setMessage(`Registration successful! Welcome ${response.data.userName}. Redirecting to login...`);
            setFormData({ userName: "", email: "", password: "", confirmPassword: "" });
            setTimeout(() => navigate("/login"), 2000);
        }catch(err){
            const errorMsg = err?.response?.data?.message || err?.response?.data || "Registration failed. Please try again.";
            setError(typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg));
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="container mt-5" style={{ maxWidth: "450px" }}>
            <div className="card shadow p-4">
                <h3 className="mb-4 text-center text-primary">Create Account</h3>

                {message && <div className="alert alert-success">{message}</div>}
                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleRegister}>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Username</label>
                        <input type="text" className="form-control" name="userName" value={formData.userName} onChange={handleChange} placeholder="Choose a username"  disabled={loading}/>
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-bold">Email address</label>
                        <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} placeholder="name@city.com" disabled={loading}/>
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-bold">Password</label>
                        <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} placeholder="At least 6 characters" disabled={loading}/>
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-bold">Confirm Password</label>
                        <input type="password" className="form-control" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Re-enter your password" disabled={loading} />
                    </div>

                    <div className="d-grid mb-3">
                        <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                            {loading ? "Creating Account..." : "Sign Up"}
                        </button>
                    </div>

                    <p className="text-center text-muted">
                        Already have an account? <a href="/login">Login here</a>
                    </p>
                </form>
            </div>
        </div>
    );
}