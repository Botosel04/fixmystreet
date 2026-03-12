import ReportForm from './components/ReportForm';
import LoginForm from './components/LoginForm';
import NavBar from './components/NavBar';

import {BrowserRouter, Routes, Route, Link} from "react-router";

function App() {
  return (
      <BrowserRouter>
        <NavBar />
        <div className={"container"}>
            <Routes>
                <Route path="/" element={
                    <div className="text-center mt-5">
                        <h1 className="display-4">Welcome to Fix My Street</h1>
                        <p className="lead">Help keep our city clean and safe.</p>
                        <Link to="/report" className="btn btn-success btn-lg mt-3">Report a Problem Now</Link>
                    </div>
                } />
                <Route path="/report" element={<ReportForm />} />
                <Route path="/login" element={<LoginForm />} />
            </Routes>
        </div>
      </BrowserRouter>
  )
}

export default App
