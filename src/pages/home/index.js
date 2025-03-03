import React, { useState, useEffect } from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Typewriter from "typewriter-effect";
import { introdata, meta } from "../../content_option";
import { Link } from "react-router-dom";
import RiveAnimation from "../../components/RiveAnimation";

export const Home = () => {
  const [useRiveAnimation, setUseRiveAnimation] = useState(true);
  const [riveError, setRiveError] = useState(false);

  // Check if Rive package is available
  useEffect(() => {
    try {
      // Check if we can import Rive
      import('@rive-app/react-canvas')
        .then(() => {
          console.log("Rive package loaded successfully");
          setUseRiveAnimation(true);
        })
        .catch(err => {
          console.error("Error loading Rive package:", err);
          setUseRiveAnimation(false);
          setRiveError(true);
        });
    } catch (error) {
      console.error("Error checking Rive:", error);
      setUseRiveAnimation(false);
      setRiveError(true);
    }
  }, []);

  // Fallback image component
  const FallbackImage = () => (
    <div style={{ 
      width: '100%', 
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      borderRadius: '8px'
    }}>
      <img 
        src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
        alt="AI and Technology"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
    </div>
  );

  return (
    <HelmetProvider>
      <section id="home" className="home">
        <Helmet>
          <meta charSet="utf-8" />
          <title> {meta.title}</title>
          <meta name="description" content={meta.description} />
        </Helmet>
        <div className="intro_sec d-block d-lg-flex align-items-center ">
          <div className="h_bg-image order-2 order-lg-2 h-100 " style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '500px', // Ensure minimum height on all screens
            height: '100%'
          }}>
            {useRiveAnimation ? (
              <RiveAnimation />
            ) : (
              <FallbackImage />
            )}
          </div>
          <div className="text order-1 order-lg-1 h-100 d-lg-flex justify-content-center">
            <div className="align-self-center ">
              <div className="intro mx-auto">
                <h2 className="mb-1x">{introdata.title}</h2>
                <h1 className="fluidz-48 mb-1x">
                  <Typewriter
                    options={{
                      strings: [
                        introdata.animated.first,
                        introdata.animated.second,
                        introdata.animated.third,
                      ],
                      autoStart: true,
                      loop: true,
                      deleteSpeed: 10,
                    }}
                  />
                </h1>
                <p className="mb-1x">{introdata.description}</p>
                <div className="intro_btn-action pb-5">
                  <Link to="/portfolio" className="text_2">
                    <div id="button_p" className="ac_btn btn ">
                      My Portfolio
                      <div className="ring one"></div>
                      <div className="ring two"></div>
                      <div className="ring three"></div>
                    </div>
                  </Link>
                  <Link to="/contact">
                    <div id="button_h" className="ac_btn btn">
                      Contact Me
                      <div className="ring one"></div>
                      <div className="ring two"></div>
                      <div className="ring three"></div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </HelmetProvider>
  );
};
