import {Link} from "react-router";
export default function NavBar(){
    return(
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4 shadow">
        <div className="container">
            <Link className="navbar-brand fw-bold" to="/">Fix My Street</Link>
            <div className="navbar-nav ms-auto">
                <Link className="nav-link" to="/report">Report Issue</Link>
                <Link className="nav-link btn btn-outline-light ms-3 px-3" to="/login">Login</Link>
            </div>
        </div>
    </nav>
    )
}