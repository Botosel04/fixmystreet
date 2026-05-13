import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthProvider";

export default function NavBar() {
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4 shadow">
            <div className="container">
                <Link className="navbar-brand fw-bold" to="/">Fix My Street</Link>
                <div className="navbar-nav ms-auto">
                    <Link className="nav-link" to="/report">Report Issue</Link>

                    {!user ? (
                        <>
                            <Link className="nav-link btn btn-outline-light ms-2 px-3" to="/register">Sign Up</Link>
                            <Link className="nav-link btn btn-outline-success ms-2 px-3" to="/login">Login</Link>
                        </>
                    ) : (
                        <>
                            <Link className="nav-link ms-2" to="/profile">Profile</Link>
                            <button className="btn btn-outline-danger ms-2" onClick={handleLogout}>Logout</button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}