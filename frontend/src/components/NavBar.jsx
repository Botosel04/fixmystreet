import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthProvider";

export default function NavBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const isActive = (path) => location.pathname === path;

    return (
        <>
            <style>{`
                .fms-nav {
                    position: sticky;
                    top: 0;
                    z-index: 100;
                    background: rgba(255, 255, 255, 0.92);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border-bottom: 1px solid #F0F0EE;
                    padding: 0 24px;
                    height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    font-family: 'DM Sans', system-ui, sans-serif;
                }

                .fms-nav-brand {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    text-decoration: none;
                    font-weight: 700;
                    font-size: 16px;
                    color: #111827;
                    letter-spacing: -0.02em;
                }

                .fms-nav-brand-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #16A35A;
                }

                .fms-nav-links {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }

                .fms-nav-link {
                    text-decoration: none;
                    font-size: 14px;
                    font-weight: 500;
                    color: #6B7280;
                    padding: 6px 12px;
                    border-radius: 8px;
                    transition: color 0.15s, background 0.15s;
                }
                .fms-nav-link:hover { color: #111827; background: #F3F4F6; }
                .fms-nav-link.active { color: #111827; background: #F3F4F6; }

                .fms-nav-divider {
                    width: 1px;
                    height: 20px;
                    background: #E5E7EB;
                    margin: 0 8px;
                }

                .fms-btn-report {
                    text-decoration: none;
                    font-size: 13px;
                    font-weight: 600;
                    color: #fff;
                    background: #16A35A;
                    padding: 7px 16px;
                    border-radius: 8px;
                    transition: opacity 0.15s, transform 0.15s;
                    letter-spacing: 0.01em;
                }
                .fms-btn-report:hover { opacity: 0.88; transform: translateY(-1px); color: #fff; }

                .fms-btn-outline {
                    text-decoration: none;
                    font-size: 13px;
                    font-weight: 600;
                    color: #374151;
                    background: transparent;
                    border: 1px solid #E5E7EB;
                    padding: 6px 14px;
                    border-radius: 8px;
                    transition: border-color 0.15s, background 0.15s;
                }
                .fms-btn-outline:hover { border-color: #D1D5DB; background: #F9FAFB; color: #111827; }

                .fms-btn-logout {
                    font-size: 13px;
                    font-weight: 600;
                    color: #DC2626;
                    background: transparent;
                    border: 1px solid #FECACA;
                    padding: 6px 14px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-family: inherit;
                    transition: background 0.15s, border-color 0.15s;
                }
                .fms-btn-logout:hover { background: #FEF2F2; border-color: #FCA5A5; }

                .fms-user-pill {
                    display: flex;
                    align-items: center;
                    gap: 7px;
                    font-size: 13px;
                    font-weight: 500;
                    color: #374151;
                    background: #F3F4F6;
                    padding: 5px 12px 5px 6px;
                    border-radius: 20px;
                }
                .fms-user-avatar {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #16A35A, #059669);
                    color: #fff;
                    font-size: 11px;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
            `}</style>

            <nav className="fms-nav">
                {/* Brand */}
                <Link to="/" className="fms-nav-brand">
                    <div className="fms-nav-brand-dot" />
                    Fix My Street
                </Link>

                {/* Right side */}
                <div className="fms-nav-links">
                    <Link
                        to="/report"
                        className="fms-btn-report"
                    >
                        + Report Issue
                    </Link>

                    <div className="fms-nav-divider" />

                    {!user ? (
                        <>
                            <Link to="/register" className="fms-btn-outline">Sign Up</Link>
                            <Link
                                to="/login"
                                className="fms-nav-link"
                                style={{ marginLeft: 2 }}
                            >
                                Login
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/profile" className="fms-user-pill" style={{ textDecoration: "none" }}>
                                <div className="fms-user-avatar">
                                    {user.email?.[0]?.toUpperCase() ?? "U"}
                                </div>
                                {user.email?.split("@")[0]}
                            </Link>
                            <button className="fms-btn-logout" onClick={handleLogout}>
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </nav>
        </>
    );
}