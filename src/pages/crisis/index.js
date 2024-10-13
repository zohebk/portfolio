import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Container, Row, Col } from "react-bootstrap";

export const CrisisPage = () => {
  const [newsArticles, setNewsArticles] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate
  const [reload, setReload] = useState(0);

  const fetchNewsData = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/news");
      const data = await response.json();
      setNewsArticles(data);
    } catch (err) {
      alert(err);
    }
  }

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3002');

    socket.addEventListener('open', () => {});

    socket.addEventListener('message', (event) => {
      setReload(reload => reload + 1);
    });

    return () => {
      socket.close();
    };
  }, []);

  // Fetching crisis-related news data
  useEffect(() => {
    fetchNewsData();
  }, [reload]);

  // Handle navigation to another page with articleTitle passed as state
  const handleNavigate = (articleTitle) => {
    navigate("/ports-affected", { state: { articleTitle } });
  };


  return (
    <HelmetProvider>
      <Container className="CrisisPage-header">
        <Helmet>
          <meta charSet="utf-8" />
          <title> Crisis | CrisisPage</title>
          <meta name="description" content="Latest crisis news updates" />
        </Helmet>

        <Row className="mb-5 mt-3 pt-md-3">
          <Col lg="8">
            <h1 className="display-4 mb-4">Crisis News</h1>
            <hr className="t_border my-4 ml-0 text-left" />
          </Col>
        </Row>

        <Row className="sec_sp">
          <Col lg="12">
            {newsArticles.length > 0 ? (
              newsArticles.map((article, index) => (
                <div key={index} className="news-article mb-4">
                  <h3 style={{ display: "inline-block", marginRight: 10 }}>
                    {article.title}
                  </h3>

                  <p>{article.description}</p>
                  <a href={article.url} target="_blank" rel="noopener noreferrer">
                    Read more
                  </a>

                  <div style={{marginTop: 5}}>
                  <button onClick={() => handleNavigate(article.title)}>
                    View Ports Affected
                  </button>
                  </div>
                 
                </div>
              ))
            ) : (
              <p>No news articles available</p>
            )}
          </Col>
        </Row>
      </Container>
    </HelmetProvider>
  );
};
