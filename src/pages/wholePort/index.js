import React, { useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./style.css";
import { Container, Row, Col } from "react-bootstrap";
import { Helmet, HelmetProvider } from "react-helmet-async";
import html2pdf from "html2pdf.js"; // Import html2pdf.js


export const PortReport = () => {
    const location = useLocation();
    const portName = new URLSearchParams(location.search).get("portName");


    return (
        <HelmetProvider>
          <Container className="Reports-header" id="full-report"> {/* Added id to capture everything */}
            <Helmet>
              <meta charSet="utf-8" />
              <title> Report | {portName}</title>
              <meta name="description" content="Update itinerary in a report" />
            </Helmet>
            <div style={{ paddingBottom: 10 }}>
              <Row className="mb-5 mt-3 pt-md-3">
                <Col lg="8">
                  <h1 className="display-4 mb-4"> Port Report for {portName}</h1>
                  <hr className="t_border my-4 ml-0 text-left" />
                </Col>
              </Row>
    
              <Row className="sec_sp">
                <Col lg="12">
                  
                  <div className="reportDiv" id="report-content">
                    <p>Here is the reccommended new schedule of ships for each berth.</p>
                    
                  </div>
                  
                </Col>
              </Row>
            </div>
          </Container>
        </HelmetProvider>
      );
};
