import React, { useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./style.css";
import { Container, Row, Col } from "react-bootstrap";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import shipIconUrl from '../../assets/images/cargo-ship_870107.png';
import html2pdf from "html2pdf.js"; // Import html2pdf.js
import html2canvas from "html2canvas"; // Import html2canvas

export const ReportPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const shipName = queryParams.get("shipName");  // Get the shipName from query params

  // Define ship icon for the marker
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
  }];

  const mapRef = useRef(); // Define mapRef using useRef()
  const [mapLoaded, setMapLoaded] = useState(false); // Track if the map is loaded

  // Mark when the map is loaded
  const handleMapLoad = () => {
    setMapLoaded(true);
  };

  // Function to capture the map as an image using leaflet's built-in method
  const captureMapAsImage = () => {
    if (!mapLoaded || !mapRef.current) {
      console.error("Map is not fully loaded or ref is not defined.");
      return;
    }

    // Capture the map's image using the Leaflet method `toDataURL`
    const mapContainer = mapRef.current.leafletElement._container; // Get the map container
    const mapImage = mapRef.current.leafletElement.getCanvas().toDataURL("image/png"); // Use canvas to capture the map as an image

    const img = new Image();
    img.src = mapImage;
    img.style.width = "100%";

    // Append the image to the report
    document.getElementById("report-content").appendChild(img);
  };

  const downloadPDF = () => {
    const element = document.getElementById("full-report"); // Select the entire report container

    if (!element) {
      console.error("Report content not found!");
      return;
    }

    setTimeout(() => {
      captureMapAsImage(); // Capture the map as an image

      const opt = {
        margin: 10,
        filename: `report_${shipName}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
      };

      // Generate PDF and download
      html2pdf().from(element).set(opt).save(); 
    }, 1000); // Wait 1 second to allow map to load
  };

  return (
    <HelmetProvider>
      <Container className="Reports-header" id="full-report"> {/* Added id to capture everything */}
        <Helmet>
          <meta charSet="utf-8" />
          <title> Report | {shipName}</title>
          <meta name="description" content="Update itinerary in a report" />
        </Helmet>
        <div style={{ paddingBottom: 10 }}>
          <Row className="mb-5 mt-3 pt-md-3">
            <Col lg="8">
              <h1 className="display-4 mb-4">Report for {shipName}</h1>
              <hr className="t_border my-4 ml-0 text-left" />
            </Col>
          </Row>

          <Row className="sec_sp">
            <Col lg="12">
              <p className="headerpara">Here are the details for the ship {shipName}.</p>
              <MapContainer
                ref={mapRef} // Set the reference to the MapContainer
                center={[66.02695, 12.253821666666665]} // Use ship's actual position
                zoom={5} // Set a zoom level to fit the map
                style={{ height: 400, width: "80%" }}
                whenCreated={handleMapLoad} // Mark map as loaded once created
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
              <div className="reportDiv" id="report-content">
                <p className="reportP">Original arrival time: 15:00</p>
                <p className="reportP">Estimated new arrival time: 18:00</p>
                <p>Fuel saved: 10%</p>
                <p className="reportP">Reason for rerouting: Due to hurricanes within 10km of the area, new rerouting is needed to refrain from overcrowding of port A</p>
              </div>
              <button onClick={downloadPDF}>
                Download PDF
              </button>
            </Col>
          </Row>
        </div>
      </Container>
    </HelmetProvider>
  );
};
