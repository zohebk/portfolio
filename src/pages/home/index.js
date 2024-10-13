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
    console.log("hi");
  }, [reload]);

  const aisData = [{
    Route: [
      {
        latitude: 66.02695,
        longitude: 12.253821666666665,
      },
      {
        latitude: 67.0,
        longitude: 13.0,
      },
      {
        latitude: 68.0,
        longitude: 14.0,
      },
      {
        latitude: 69.0,
        longitude: 15.0,
      }
    ],
    "info": {
      "MMSI": 259000420,
      "ShipName": "AUGUSTSON",
    }
  },
  {
    Route: [
      {
        latitude: 35.6895,
        longitude: 139.6917, // Tokyo coordinates
      },
      {
        latitude: 36.0,
        longitude: 140.0,
      },
      {
        latitude: 37.0,
        longitude: 141.0,
      },
      {
        latitude: 38.0,
        longitude: 142.0,
      }
    ],
    info: {
      MMSI: 123456789,
      ShipName: "SEASPRAY",
    }
  }]

  const alertData = [
    {
      location: {
        latitude: 37.7749,
        longitude: -122.4194,
      },
      info: {
        type: 'Earthquake',
        description: 'Magnitude 5.6 earthquake',
        impactRadius: 500,
        articleTitle: "Magnitude 5.6 Earthquake Strikes San Francisco Bay Area",
      },
    },
    {
      location: {
        latitude: 40.7128,
        longitude: -74.0060,
      },
      info: {
        type: 'Flood',
        description: 'Severe flooding warning',
        impactRadius: 200,
        articleTitle: "Severe Flooding Warning Issued for New York City",

      },
    },
    {
      location: {
        latitude: 35.6762,
        longitude: 139.6503,
      },
      info: {
        type: 'Tsunami',
        description: 'Tsunami alert following earthquake',
        impactRadius: 1000,
        articleTitle: "Tsunami Alert Issued Following Earthquake Near Japan",
      },
    },
  ];


  const handleNavigate = (articleTitle) => {
    navigate("/ports-affected", { state: { articleTitle } });
  };
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
            <text>{reload}</text>

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
                {aisData.map((vessel, index) => (
                  <React.Fragment key={index}>
                    <Marker
                      position={[
                        vessel.Route[0].latitude,
                        vessel.Route[0].longitude,
                      ]}
                      icon={shipIcon}
                    >
                      <Popup>
                        <div>
                          <h3>{vessel.info.ShipName || "Unknown Vessel"}</h3>
                          <p><strong>MMSI:</strong> {vessel.info.MMSI}</p>
                          <p><strong>Latitude:</strong> {vessel.Route[0].latitude}</p>
                          <p><strong>Longitude:</strong> {vessel.Route[0].longitude}</p>
                        </div>
                      </Popup>
                    </Marker>

                    {/* Create the polyline for the projected route */}
                    <Polyline
                      positions={vessel.Route.map(point => [point.latitude, point.longitude])}
                      color="grey" // You can customize the color here
                      weight={3} // Customize the weight of the polyline
                    />

                    {vessel.Route.slice(1).map((point, pointIndex) => (
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
                {alertData.map((alert, index) => (
                  <Marker
                    key={index}
                    position={[alert.location.latitude, alert.location.longitude]}
                    icon={new L.DivIcon({
                      className: 'blinking-icon', // Applying the CSS class for the blinking effect
                      iconSize: getIconSize(alert.info.impactRadius),
                      iconAnchor: [getIconSize(alert.info.impactRadius)[0] / 2, getIconSize(alert.info.impactRadius)[1] / 2],
                      popupAnchor: [0, -getIconSize(alert.info.impactRadius)[1] / 2],
                    })}
                  >
                    <Popup>
                      <h3>{alert.info.type}</h3>
                      <p>{alert.info.description}</p>
                      <p><strong>Impact Radius: </strong>{alert.info.impactRadius} km</p>
                      <button className="viewPortBtn" onClick={() => handleNavigate(alert.info.articleTitle)}>View ports affected</button>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            )}
          </div>
        </div>
      </section>
    </HelmetProvider>
  );
};

