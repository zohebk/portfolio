import React from "react";
import { useLocation } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { dataportfolio, schedule } from "../../content_option";  // Import the data
import html2pdf from "html2pdf.js"; // Import html2pdf.js

export const PortReport = () => {
    const location = useLocation();
    const portName = new URLSearchParams(location.search).get("portName");

    // Find the port by its name
    const portData = dataportfolio.find((port) => port.portName === portName);

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
                                <p>Here is the recommended new schedule of ships for each berth.</p>

                                {/* Render Berths Data */}
                                {portData?.berths.map((berth, index) => (
                                    <div key={index}>
                                        <h3>{berth.name}</h3>
                                        <table className="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>Date</th>
                                                    <th>Time</th>
                                                    <th>Ship Name</th>
                                                    <th>Ship ID</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {schedule.map((shipSchedule, shipIndex) => (
                                                    <tr key={shipIndex}>
                                                        <td>{shipSchedule.date}</td>
                                                        <td>{shipSchedule.time}</td>
                                                        <td>{shipSchedule.shipName}</td>
                                                        <td>{shipSchedule.shipID}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ))}
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
