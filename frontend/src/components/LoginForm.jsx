import { useState } from "react";
import axios from "axios";

export default function LoginForm() {
    const [credentials, setCredentials] = useState({
        email: "",
        password: ""
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            const response = await axios.post("http://localhost:8080/api/auth/login", credentials);
            const { token, email, role } = response.data;

            localStorage.setItem("token", token);
            localStorage.setItem("email", email);
            localStorage.setItem("role", role);

            setMessage(`Logged in as ${email} (${role})`);
        } catch (err) {
            setError(err?.response?.data || "Login failed. Please check your email and password.");
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "400px" }}>
            <div className="card shadow p-4">
                <h3 className="mb-4 text-center text-primary">Login</h3>

                {message && <div className="alert alert-success">{message}</div>}
                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Email address</label>
                        <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={credentials.email}
                            onChange={handleChange}
                            placeholder="name@city.com"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-bold">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary btn-lg">
                            Sign In
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}