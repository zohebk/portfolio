import React, { useState } from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Container, Row, Col } from "react-bootstrap";
import { dataportfolio, meta } from "../../content_option";
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // Import arrow icons

export const Portfolio = () => {
  const [selectedPorts, setSelectedPorts] = useState({});

  const handlePortClick = (port) => {
    setSelectedPorts((prevState) => {
      return {
        ...prevState,
        [port.portName]: !prevState[port.portName],
      };
    });
  };

  return (
    <HelmetProvider>
      <Container className="About-header">
        <Helmet>
          <meta charSet="utf-8" />
          <title>Red Sea Crisis | {meta.title}</title>
          <meta name="description" content={meta.description} />
        </Helmet>

        <Row className="mb-5 mt-3 pt-md-3">
          <Col lg="8">
            <h1 className="display-4 mb-4">Hurricane Katrina</h1>
            <hr className="t_border my-4 ml-0 text-left" />
          </Col>
        </Row>

        {/* Ports Affected Header with Toggle */}
        <div className="mb-5 mt-3 pt-md-3">
          <Col lg="14">
            <h1
              className="display-4 mb-4"
              style={{ cursor: "pointer" }}
              onClick={() => setSelectedPorts({})} // Reset all ports when the header is clicked
            >
              Ports affected:{" "}
              {Object.keys(selectedPorts).length ? (
                <FaChevronUp style={{ marginLeft: "10px", fontSize: "1.5rem" }} />
              ) : (
                <FaChevronDown style={{ marginLeft: "10px", fontSize: "1.5rem" }} />
              )}
            </h1>

            {/* Display the list of ports */}
            <div className="port-list">
              {dataportfolio.map((data, i) => (
                <div
                  key={i}
                  className="port-item"
                  style={{ cursor: "pointer"}}
                  onClick={() => handlePortClick(data)}
                >
                  {/* Port Name */}
                  <p className="port-name">{data.portName}</p>

                  {/* Conditional rendering for the berths */}
                  {selectedPorts[data.portName] && (
                    <div className="berths-list">
                      <table className="berths-table">
                        <thead>
                          <tr>
                            <th>Berth</th>
                            <th>Capacity</th>
                            <th>Status</th>
                            <th>Lots available</th>
                            <th>Ships affected</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.berths.map((berth, index) => (
                            <tr key={index}>
                              <td>{berth.name}</td>
                              <td>{berth.capacity}</td>
                              <td>{berth.status}</td>
                              <td>{berth.lotsavail}</td>

                              {/* Nested table inside "Ships affected" column */}
                              <td>
                                <table className="nested-table">
                                  <thead>
                                    <tr>
                                      <th>Ship Name</th>
                                      <th>Original Arrival Time</th>
                                      <th>New Estimated Arrival Time</th>
                                      <th>Generate Report</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {berth.Ships_affected.map((ship, shipIndex) => (
                                      <tr key={shipIndex}>
                                        <td>{ship.nameShip}</td>

                                        {/* Corrected: Iterate over the `ogTime` and `newTime` arrays to get values per ship */}
                                        <td>
                                          {berth.ogTime[shipIndex]
                                            ? berth.ogTime[shipIndex].time
                                            : "-"}
                                        </td>

                                        <td>
                                          {berth.newTime[shipIndex]
                                            ? berth.newTime[shipIndex].time
                                            : "-"}
                                        </td>
                                        <td>
                                          <button className="generateButton">Generate</button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Col>
        </div>
      </Container>
    </HelmetProvider>
  );
};
