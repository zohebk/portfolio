import React, { useEffect } from 'react';
import ReactDOM from "react-dom/client";
import App from './app/App';
import './index.css';

const Root = () => {
  useEffect(() => {
    // Set the default theme to 'light' when the app loads
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);  // Empty array ensures this runs only on initial mount

  return <App />;
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Root />
);
