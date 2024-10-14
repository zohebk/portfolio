import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { Helmet, HelmetProvider } from "react-helmet-async";
import html2pdf from "html2pdf.js"; // Import html2pdf.js

export const PortReport = () => {
    const location = useLocation();
    const portName = new URLSearchParams(location.search).get("portName");

    // State to store the ship schedule data
    const [ships, setShips] = useState([]);

    // Fetch the ships coming into the port
    const fetchAppointmentData = async () => {
        try {
            const response = await fetch("http://localhost:3001/api/appointment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ portName }),
            });
            const data = await response.json();
            setShips(data); // Store the fetched ships data in the state
        } catch (err) {
            console.error("Error fetching ship data:", err);
            alert("Error fetching ship data");
        }
    };

    // Fetch data when the component mounts
    useEffect(() => {
        fetchAppointmentData();
    }, [portName]);

    // Function to download PDF
    const downloadPDF = () => {
        const element = document.getElementById("full-report"); // Select the entire report container
        const downloadButton = document.querySelector("button"); // Select the download button

        if (!element) {
            console.error("Report content not found!");
            return;
        }

        // Hide the download button temporarily
        downloadButton.style.display = "none";

        const opt = {
            margin: 10,
            filename: `port_report_${portName}.pdf`,  // Change to a suitable filename
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
        };

        // Generate PDF and download
        html2pdf().from(element).set(opt).save().then(() => {
            // Show the button again after the PDF is generated
            downloadButton.style.display = "block";
        });
    };

    return (
        <HelmetProvider>
            <Container className="Reports-header" id="full-report">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Report | {portName}</title>
                    <meta name="description" content="Update itinerary in a report" />
                </Helmet>

                <div style={{ paddingBottom: 10 }}>
                    <Row className="mb-5 mt-3 pt-md-3">
                        <Col lg="8">
                            <h1 className="display-4 mb-4">Port Report for {portName}</h1>
                            <hr className="t_border my-4 ml-0 text-left" />
                        </Col>
                    </Row>

                    <Row className="sec_sp">
                        <Col lg="12">
                            <div className="reportDiv" id="report-content">
                                <p>Here is the recommended new schedule of ships for {portName}.</p>

                                {/* Check if ships are available and render the table */}
                                {ships.length > 0 ? (
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Ship Name</th>
                                                <th>Ship ID</th>
                                                <th>Berth</th>
                                                <th>Date & Time</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ships.map((ship, index) => (
                                                <tr key={index}>
                                                    <td>{ship.shipName}</td>
                                                    <td>{ship.shipID}</td>
                                                    <td>{ship.berthNo}</td>
                                                    <td>{new Date(ship.dateTime).toLocaleString()}</td> {/* Format Date & Time */}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p>No ships found for this port.</p>
                                )}
                            </div>
                            <button onClick={downloadPDF} style={{marginTop: 5}}>
                                Download PDF
                            </button>
                        </Col>
                    </Row>
                </div>
            </Container>
        </HelmetProvider>
    );
};
