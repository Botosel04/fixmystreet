import {useState} from "react";

export default function LoginForm(){
    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
        role: ""
    });

    const handleChange = (e) => {
        setCredentials({...credentials, [e.target.name]: e.target.value});
    }

    const handleLogin = async () => {
        console.log(credentials);
    }

    return (
        <div className="container mt-5" style={{maxWidth: '400px'}}>
            <div className="card shadow p-4">
                <h3 className="mb-4 text-center text-primary">City Worker Login</h3>

                <form onSubmit={handleLogin}>
                    {/* Email Input */}
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