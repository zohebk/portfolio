import React, { useState, useEffect } from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { map } from "leaflet";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import shipIconUrl from '../../assets/images/cargo-ship_870107.png';
import { useNavigate } from "react-router-dom";

// Default icon configuration (optional for Leaflet marker icons)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const shipIcon = new L.Icon({
  iconUrl: shipIconUrl, // Replace with the URL of your ship icon
  iconSize: [35, 35], // Size of the icon
  iconAnchor: [17, 34], // The point of the icon which will correspond to marker's location
  popupAnchor: [0, -35], // The point from which the popup should open relative to the iconAnchor
});

const getIconSize = (impactRadius) => {
  const baseSize = 30; // Base size for a minimal disaster
  const scaleFactor = 0.05; // You can adjust this scale factor
  const scaledSize = baseSize + (impactRadius * scaleFactor);
  return [scaledSize, scaledSize]; // Return as [width, height]
};

export const Home = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [reload, setReload] = useState(0);
  const [records, setRecords] = useState([]);
  const [alert, setAlerts] = useState([]);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3002');

    socket.addEventListener('open', () => {
      console.log('Connected to WebSocket server');
    });

    socket.addEventListener('message', (event) => {
      const newMessage = event.data;
      setReload(reload => reload + 1);
    });

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    fetchVesselData();
  }, [reload]);

  // Fetching crisis-related news data
  useEffect(() => {
    fetchNewsData();
  }, [reload]);

  const fetchNewsData = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/news");
      const data = await response.json();
      setAlerts(data);
    } catch (err) {
      alert(err);
    }
  }

  const fetchVesselData = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/vessel/all", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setRecords(data);
      console.log(records);
    } catch (err) {
      setRecords("ERROR");
      alert(err);
    }
  }

  const handleNavigate = (articleTitle) => {
    navigate("/ports-affected", { state: { articleTitle } });
  };

  const radius = (long1, long2, lat1, lat2) => {
    const deltaLatitude = lat2 - lat1;
    const deltaLongitude = long2 - long1;

    // Calculate the hypotenuse length
    const hypotenuse = Math.sqrt(deltaLatitude ** 2 + deltaLongitude ** 2)/2;
    return hypotenuse;
  }
  
  return (
    <HelmetProvider>
      <section id="home" className="home">
        <Helmet>
          <meta charSet="utf-8" />
          <title>AIS Vessel Map</title>
          <meta name="description" content="Live AIS data displayed on a map" />
        </Helmet>

        <div>
          <div>
            <h2 className="mb-1x">Live AIS Vessel Data on Map</h2>

            {loading ? (
              <p>Loading AIS data...</p>
            ) : error ? (
              <p>Error loading data: {error}</p>
            ) : (
              <MapContainer
                center={[0, 0]} // Center the map on the ship's position
                zoom={2} // Zoom in closer
                className="mapCont"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {records.map((vessel, index) => (
                  <React.Fragment key={index}>
                    <Marker
                      position={[
                        vessel.routes[0].latitude,
                        vessel.routes[0].longitude,
                      ]}
                      icon={shipIcon}
                    >
                      <Popup>
                        <div>
                          <h3>{vessel.info.ShipName || "Unknown Vessel"}</h3>
                          <p><strong>MMSI:</strong> {vessel.info.MMSI}</p>
                          <p><strong>Latitude:</strong> {vessel.routes[0].latitude}</p>
                          <p><strong>Longitude:</strong> {vessel.routes[0].longitude}</p>
                        </div>
                      </Popup>
                    </Marker>

                    {/* Create the polyline for the projected route */}
                    <Polyline
                      positions={vessel.routes.map(point => [point.latitude, point.longitude])}
                      color="grey" // You can customize the color here
                      weight={3} // Customize the weight of the polyline
                    />

                    {vessel.routes.slice(1).map((point, pointIndex) => (
                      <CircleMarker
                        key={`future-${index}-${pointIndex}`}
                        center={[point.latitude, point.longitude]}
                        radius={3} // Size of the black dot
                        pathOptions={{ color: 'black', fillColor: 'black', fillOpacity: 1 }}
                      />
                    ))}
                  </React.Fragment>
                ))}

                {/* Displaying disaster alerts */}
                {alert.map((alert, index) => {
                  const latitude1 = alert.latitude1;
                  const latitude2 = alert.latitude2;
                  const longitude1 = alert.longitude1;
                  const longitude2 = alert.longitude2;

                  // Check if the coordinates are valid numbers before proceeding
                  if (
                    typeof latitude1 === 'number' && 
                    typeof latitude2 === 'number' &&
                    typeof longitude1 === 'number' && 
                    typeof longitude2 === 'number'
                  ) {
                    const midLatitude = (latitude1 + latitude2) / 2;
                    const midLongitude = (longitude1 + longitude2) / 2;
                    const impactRadius = radius(longitude1, longitude2, latitude1, latitude2);

                    return (
                      <Marker
                        key={index}
                        position={[midLatitude, midLongitude]}
                        icon={new L.DivIcon({
                          className: 'blinking-icon',
                          iconSize: getIconSize(impactRadius),
                          iconAnchor: [
                            getIconSize(impactRadius)[0] / 2,
                            getIconSize(impactRadius)[1] / 2,
                          ],
                          popupAnchor: [0, -getIconSize(impactRadius)[1] / 2],
                        })}
                      >
                        <Popup>
                          <h3>{alert.title}</h3>
                          <p>{alert.description}</p>
                          <p><strong>Impact Radius: </strong>{impactRadius.toFixed(2)} km</p>
                          <button className="viewPortBtn" onClick={() => handleNavigate(alert.title)}>
                            View ports affected
                          </button>
                        </Popup>
                      </Marker>
                    );
                  } else {
                    console.warn("Invalid coordinates for alert", alert);
                    return null; // Skip rendering if coordinates are invalid
                  }
                })}
              </MapContainer>
            )}
          </div>
        </div>
      </section>
    </HelmetProvider>
  );
};

