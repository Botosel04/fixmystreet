import ReportForm from './components/ReportForm';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Profile from './components/Profile';
import MapComponent from './components/MapComponent';
import HomePage from './components/HomePage';
import NavBar from './components/NavBar';
import { AuthProvider } from './auth/AuthProvider';
import IssuePage from './components/IssuePage.jsx';



import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

function App() {
    const [mapLocation, setMapLocation] = useState({
        latitude: null,
        longitude: null,
    });

    return (
        <AuthProvider>
            <BrowserRouter>
                <NavBar />
                <div>
                    <Routes>
                        <Route path="/" element={<HomePage />} />

                        <Route path="/report" element={
                            <div style={{ height: "calc(100vh - 80px)", display: "flex", gap: "0" }}>
                                <div style={{ flex: "0 0 35%", overflowY: "auto", padding: "20px", backgroundColor: "#f8f9fa" }}>
                                    <ReportForm
                                        latitude={mapLocation.latitude}
                                        longitude={mapLocation.longitude}
                                        onLocationSelect={(coords) => setMapLocation(coords)}
                                    />
                                </div>
                                <div style={{ flex: "0 0 65%", padding: "20px" }}>
                                    <MapComponent
                                        latitude={mapLocation.latitude}
                                        longitude={mapLocation.longitude}
                                        onLocationSelect={(coords) => setMapLocation(coords)}
                                    />
                                </div>
                            </div>
                        } />

                        <Route path="/login" element={
                            <div className="container">
                                <LoginForm />
                            </div>
                        } />

                        <Route path="/register" element={
                            <div className="container">
                                <RegisterForm />
                            </div>
                        } />

                        <Route path="/profile" element={
                            <div className="container">
                                <Profile />
                            </div>
                        } />
                        <Route path="/issues/:id" element={<IssuePage />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;