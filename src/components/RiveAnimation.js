import { useState, useEffect, useRef } from 'react';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import './RiveAnimation.css'; // We'll create this CSS file next

// Create a wrapper component to handle the Rive animation
const RiveAnimation = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef(null);
  
  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
      const isMobileDevice = mobileRegex.test(userAgent.toLowerCase());
      setIsMobile(isMobileDevice || window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Configure Rive with recommended settings from the documentation
  const { rive, RiveComponent } = useRive({
    src: process.env.PUBLIC_URL + '/ZohebAi.riv',
    autoplay: true,
    // Use Layout for proper sizing and positioning
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
    // Enable touch interactions for mobile
    shouldDisableRiveListeners: false,
    onLoadError: (e) => {
      console.error("Rive file load error:", e);
      setError("The animation couldn't be loaded. Using image fallback.");
      setIsLoading(false);
    },
    onLoad: () => {
      console.log("Rive file loaded successfully!");
      setIsLoading(false);
    }
  });

  // Ensure proper sizing of the container
  useEffect(() => {
    if (containerRef.current && !isLoading && !error && !isMobile) {
      // Force a resize event to ensure the canvas is properly sized
      window.dispatchEvent(new Event('resize'));
    }
  }, [isLoading, error, isMobile]);

  // Render the image with animations for mobile
  const renderMobileImage = () => {
    return (
      <div className="mobile-image-container">
        <div className="image-wrapper">
          <img 
            src={process.env.PUBLIC_URL + '/zoheb.jpg'} 
            alt="Zoheb" 
            className="profile-image animated"
          />
          <div className="overlay-effect"></div>
        </div>
      </div>
    );
  };

  // Fallback content if Rive fails to load
  const renderFallbackContent = () => {
    return (
      <div style={{ 
        width: '100%', 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        color: '#333',
        textAlign: 'center',
        padding: '20px',
        borderRadius: '8px'
      }}>
        <div className="mobile-image-container">
          <div className="image-wrapper">
            <img 
              src={process.env.PUBLIC_URL + '/zoheb.jpg'} 
              alt="Zoheb" 
              className="profile-image animated"
            />
            <div className="overlay-effect"></div>
          </div>
        </div>
      </div>
    );
  };

  // For mobile devices, show the image with animations
  if (isMobile) {
    return renderMobileImage();
  }

  return (
    <div 
      ref={containerRef}
      style={{ 
        width: '100%', 
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        borderRadius: '8px',
        position: 'relative'
      }}
    >
      {isLoading && (
        <div className="loading-animation">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      )}
      
      {error ? renderFallbackContent() : (
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <RiveComponent />
        </div>
      )}
    </div>
  );
};

export default RiveAnimation; 