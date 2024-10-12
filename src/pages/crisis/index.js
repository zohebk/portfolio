import React, { useEffect, useState } from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Container, Row, Col } from "react-bootstrap";

export const CrisisPage = () => {
  const [newsArticles, setNewsArticles] = useState([]);

  // Fetching crisis-related news data (assuming using a news API)
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=crisis&apiKey=925e84534f414b00923ae341b365c582`
        );
        const data = await response.json();
        setNewsArticles(data.articles);
      } catch (error) {
        console.error("Error fetching crisis news:", error);
      }
    };

    fetchNews();
  }, []);

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
                  <h3>{article.title}</h3>
                  <p>{article.description}</p>
                  <a href={article.url} target="_blank" rel="noopener noreferrer">
                    Read more
                  </a>
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
