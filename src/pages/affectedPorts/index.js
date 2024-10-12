import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";

export const PortsAffectedPage = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate
  const { articleTitle } = location.state || {}; // Get the article title from the state

  // Log the location object to check if state is passed correctly
  console.log("Navigated to PortsAffectedPage with state:", location.state);

  return (
    <Container>
      <Row className="mb-5 mt-3 pt-md-3">
        <Col lg="8">
          <h1 className="display-4 mb-4">Ports Affected by Crisis</h1>
          <hr className="t_border my-4 ml-0 text-left" />
          {articleTitle ? (
            <p>
              Showing ports affected by the crisis: <strong>{articleTitle}</strong>
            </p>
          ) : (
            <p>No crisis data provided.</p>
          )}

          <div>
            <h3>Port 1</h3>
            <p>Details about how Port 1 is affected by the crisis.</p>

            <h3>Port 2</h3>
            <p>Details about how Port 2 is affected by the crisis.</p>
          </div>

          {/* Back Button */}
          <button onClick={() => navigate(-1)}>Back</button>
        </Col>
      </Row>
    </Container>
  );
};
