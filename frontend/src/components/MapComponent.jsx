import { MapContainer, TileLayer, Marker, Popup, useMapEvent, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Create a simple default icon without external URLs
const defaultIcon = L.icon({
    iconUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNSIgaGVpZ2h0PSI0MSIgdmlld0JveD0iMCAwIDI1IDQxIj48cGF0aCBmaWxsPSIjM0I4N0YzIiBkPSJNMTIuNSAwQzUuNiAwIDAgNS42IDAgMTIuNWMwIDcuNSAxMi41IDI4LjEgMTIuNSAyOC4xczEyLjUtMjAuNiAxMi41LTI4LjFDMjUgNS42IDE5LjQgMCAxMi41IDB6bTAgMTYuN2MtMi4zIDAtNC4yLTEuOS00LjItNC4yYzAtMi4zIDEuOS00LjIgNC4yLTQuMnM0LjIgMS45IDQuMiA0LjJjMCAyLjMtMS45IDQuMi00LjIgNC4yeiIvPjwvc3ZnPg==",
    shadowUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MSIgaGVpZ2h0PSI0MSIgdmlld0JveD0iMCAwIDQxIDQxIj48ZWxsaXBzZSBjeD0iMjAuNSIgY3k9IjM4IiByeD0iMjAuNSIgcnk9IjMiIGZpbGw9IiMwMDAwMDAiIG9wYWNpdHk9IjAuMyIvPjwvc3ZnPg==",
    iconSize: [25, 41],
    shadowSize: [41, 41],
    iconAnchor: [12, 41],
    shadowAnchor: [12, 41],
    popupAnchor: [1, -34],
});

L.Icon.Default.prototype.options = defaultIcon.options;

function MapClickHandler({ onMapClick }) {
    useMapEvent("click", (e) => {
        console.log("Map clicked at:", e.latlng);
        const { lat, lng } = e.latlng;
        onMapClick({ latitude: lat, longitude: lng });
    });
    return null;
}

function MapRecenter({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, 13);
        }
    }, [center, map]);
    return null;
}

export default function MapComponent({ latitude, longitude, onLocationSelect }) {
    const [selectedLocation, setSelectedLocation] = useState(
        latitude && longitude ? [latitude, longitude] : null
    );
    const [center, setCenter] = useState([51.505, -0.09]);
    const [loading, setLoading] = useState(true);
    const [geoError, setGeoError] = useState("");

    // Get user's geolocation on mount
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude: lat, longitude: lng } = position.coords;
                    console.log("Geolocation found:", lat, lng);
                    setCenter([lat, lng]);
                    if (!latitude || !longitude) {
                        setSelectedLocation([lat, lng]);
                        onLocationSelect({ latitude: lat, longitude: lng });
                    }
                    setLoading(false);
                },
                (error) => {
                    console.log("Geolocation error:", error.message);
                    setGeoError("Could not get your location. Using default map center.");
                    setLoading(false);
                }
            );
        } else {
            setLoading(false);
        }
    }, []);

    const handleMapClick = (coords) => {
        console.log("handleMapClick called with:", coords);
        setSelectedLocation([coords.latitude, coords.longitude]);
        onLocationSelect(coords);
    };

    return (
        <div style={{ height: "100%", position: "relative", borderRadius: "8px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: "100%" }}>
                {loading && (
                    <div
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            zIndex: 1000,
                            backgroundColor: "rgba(255,255,255,0.9)",
                            padding: "20px",
                            borderRadius: "8px",
                            textAlign: "center",
                        }}
                    >
                        <p>Loading your location...</p>
                    </div>
                )}

                <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <MapClickHandler onMapClick={handleMapClick} />
                    <MapRecenter center={center} />

                    {selectedLocation && (
                        <Marker position={selectedLocation} icon={defaultIcon}>
                            <Popup>
                                <div>
                                    <p className="mb-2">
                                        <strong>📍 Location selected</strong>
                                    </p>
                                    <p className="mb-1">
                                        <strong>Lat:</strong> {selectedLocation[0].toFixed(6)}
                                    </p>
                                    <p className="mb-0">
                                        <strong>Lng:</strong> {selectedLocation[1].toFixed(6)}
                                    </p>
                                </div>
                            </Popup>
                        </Marker>
                    )}
                </MapContainer>
            </div>
        </div>
    );
}