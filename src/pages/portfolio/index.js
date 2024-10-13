import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Container, Row, Col } from "react-bootstrap";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { meta } from "../../content_option";

export const Portfolio = () => {
  const location = useLocation();
  const articleTitle = location.state?.articleTitle || "No Title Provided";
  const [selectedPorts, setSelectedPorts] = useState({});
  const [records, setRecords] = useState([]);
  const [display, setDisplay] = useState();

  const fetchShipData = async () => {
    try {
      const newsTitle = articleTitle;
      const response = await fetch("http://localhost:3001/api/record", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newsTitle }),
      });
      const data = await response.json();
      return data;
    } catch (err) {
      setRecords("ERROR");
      alert(err);
    }
  };

  const getListOfPortNamesOverall = (data) => {
    const portNames = [];
    data.forEach(record => {
      const prePortOrder = record.prePortOrder;
      prePortOrder.forEach(port => {
        portNames.push(port.name);
      });
    });
    const distinctPortNames = new Set(portNames);
    return distinctPortNames;
  };

  const getListOfPortNamesIndiv = (record) => {
    const portNames = [];
    const prePortOrder = record.prePortOrder;
    prePortOrder.forEach(port => {
      portNames.push(port.name);
    });
    return portNames;
  };

  const getSubRecords = (record) => {
    const portNames = getListOfPortNamesIndiv(record);
    const prePortOrder = record.prePortOrder;
    const postPortOrder = record.postPortOrder;
    const shipName = record.shipName;
    const listOfSubRecords = [];

    portNames.forEach(portNameIndiv => {
      const originalPort = prePortOrder.find(port => port.name === portNameIndiv);
      const newPort = postPortOrder.find(port => port.name === portNameIndiv);
      const oldBerth = originalPort?.berth || "-";
      const oldETA = originalPort?.estimatedTimeOfArrival || "-";
      const newBerth = newPort?.berth || "-";
      const newETA = newPort?.estimatedTimeOfArrival || "-";
      const subRecord = {
        shipName,
        oldBerth,
        oldETA,
        newBerth,
        newETA,
        portName: portNameIndiv,
      };
      listOfSubRecords.push(subRecord);
    });

    return listOfSubRecords;
  };

  const getTotalSubRecords = (records) => {
    let listOfTotalSubRecords = [];
    for (const record of records) {
      const subRecords = getSubRecords(record);
      listOfTotalSubRecords = listOfTotalSubRecords.concat(subRecords);
    }
    return listOfTotalSubRecords;
  };

  const getFinalData = async () => {
    const data = await fetchShipData();
    const listOfPortNames = getListOfPortNamesOverall(data);
    const listOfSubRecords = getTotalSubRecords(data);
    const finalDataMap = new Map();

    listOfPortNames.forEach(port => {
      finalDataMap.set(port, []);
    });

    listOfSubRecords.forEach(subRecord => {
      finalDataMap.get(subRecord.portName).push(subRecord);
    });

    setRecords(finalDataMap);
  };

  const handlePortClick = (portName) => {
    setSelectedPorts((prevState) => ({
      ...prevState,
      [portName]: !prevState[portName],
    }));
  };

  const handleGenerateReport = (shipName, oldETA, newETA, oldBerth, newBerth) => {
    const reportUrl = `/reportPage?shipName=${encodeURIComponent(shipName)}&oldETA=${encodeURIComponent(oldETA)}&newETA=${encodeURIComponent(newETA)}&oldBerth=${encodeURIComponent(oldBerth)}&newBerth=${encodeURIComponent(newBerth)}`;
    window.open(reportUrl, "_blank");
  };
  
  

  const handlePortReport = (portName) => {
    const reportUrl = `/portreport?portName=${encodeURIComponent(portName)}`;
    window.open(reportUrl, "_blank");
  };



  useEffect(() => {
    getFinalData();
  }, []);

  return (
    <HelmetProvider>
      <Container className="About-header">
        <Helmet>
          <meta charSet="utf-8" />
          <title>{articleTitle} | {meta.title}</title>
          <meta name="description" content={meta.description} />
        </Helmet>

        <Row className="mb-5 mt-3 pt-md-3">
          <Col lg="8">
            {/* Replace "Hurricane Katrina" with the dynamically passed articleTitle */}
            <h1 className="display-4 mb-4">{articleTitle}</h1>
            <hr className="t_border my-4 ml-0 text-left" />
          </Col>
        </Row>

        <div className="general">
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
            <div className="port-list" style={{ paddingBottom: 10 }}>
              {Array.from(records.keys()).map((portName) => (
                <div key={portName} className="port-item" style={{ cursor: "pointer", marginBottom: 15 }}
                  onClick={() => handlePortClick(portName)}>
                  {/* Render port name */}
                  <p className="port-name" style={{ fontSize: 25, color: "#007bff" }}>{portName}</p>

                  {selectedPorts[portName] && (
                    <div className="berths-list">
                      <table className="berths-table">
                        <thead>
                          <tr>
                            <th>Ship Name</th>
                            <th>Old Berth</th>
                            <th>Old ETA</th>
                            <th>New Berth</th>
                            <th>New ETA</th>
                            <th>Generate Report</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Map through the records (values) for this port */}
                          {records.get(portName).map((record, index) => (
                            <tr key={index}>
                              <td>{record.shipName}</td>
                              <td>{record.oldBerth}</td>
                              <td>{record.oldETA}</td>
                              <td>{record.newBerth}</td>
                              <td>{record.newETA}</td>
                              <td>
                                <button className="generateButton"
                                  onClick={() => handleGenerateReport(record.shipName, record.oldETA, record.newETA, 
                                    record.oldBerth, record.newBerth)}
                                  style={{ marginBottom: 5 }}>
                                  Generate
                                </button>
                                
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <button className="portbutton" onClick={() => handlePortReport(portName)}>
                        Generate port report</button>
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
