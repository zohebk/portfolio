import React, { useState, useEffect } from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import shipIconUrl from '../../assets/images/cargo-ship_870107.png';

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


export const Home = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const aisData = [{
    "Message":{
       "PositionReport":{
          "Cog":308,
          "CommunicationState":81982,
          "Latitude":66.02695,
          "Longitude":12.253821666666665,
          "MessageID":1,
          "NavigationalStatus":15,
          "PositionAccuracy":true,
          "Raim":false,
          "RateOfTurn":4,
          "RepeatIndicator":0,
          "Sog":0,
          "Spare":0,
          "SpecialManoeuvreIndicator":0,
          "Timestamp":31,
          "TrueHeading":235,
          "UserID":259000420,
          "Valid":true
       }
    },
    "MessageType":"PositionReport",
    "MetaData":{
       "MMSI":259000420,
       "ShipName":"AUGUSTSON",
       "latitude":66.02695,
       "longitude":12.253821666666665,
       "time_utc":"2022-12-29 18:22:32.318353 +0000 UTC"
    }
 }]


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
                    center={[0,0]} // Center the map on the ship's position
                    zoom={2} // Zoom in closer
                    style={{ height: "100vh", width: "100vw" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {aisData.map((vessel, index) => (
                      <Marker
                      key={index}
                      position={[
                        vessel.Message.PositionReport.Latitude,
                        vessel.Message.PositionReport.Longitude,
                      ]}
                      icon={shipIcon}
                      >
                        <Popup>
                          <div>
                            <h3>{vessel.MetaData.ShipName || "Unknown Vessel"}</h3>
                            <p><strong>MMSI:</strong> {vessel.MetaData.MMSI}</p>
                            <p><strong>Latitude:</strong> {vessel.MetaData.latitude}</p>
                            <p><strong>Longitude:</strong> {vessel.MetaData.longitude}</p>
                          </div>
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

