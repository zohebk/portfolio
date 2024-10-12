import React from "react";
import { useLocation } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { dataportfolio } from "../../content_option";  // Import the data

export const PortReport = () => {
    const location = useLocation();
    const portName = new URLSearchParams(location.search).get("portName");

    // Find the port by its name
    const portData = dataportfolio.find((port) => port.portName === portName);

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
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Ship Name</th>
                                                    <th>Original Arrival Time</th>
                                                    <th>New Estimated Arrival Time</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {berth.Ships_affected.map((ship, shipIndex) => (
                                                    <tr key={shipIndex}>
                                                        <td>{ship.nameShip}</td>
                                                        <td>{ship.arrivalTime}</td>
                                                        <td>{ship.newTime}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ))}
                            </div>
                        </Col>
                    </Row>
                </div>
            </Container>
        </HelmetProvider>
    );
};
