import { useState, useEffect, useRef } from 'react';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';

// Create a wrapper component to handle the Rive animation
// This follows the recommended pattern from Rive docs for conditional rendering
const RiveAnimation = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef(null);
  
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
      setError("The animation couldn't be loaded. Please try again later.");
      setIsLoading(false);
    },
    onLoad: () => {
      console.log("Rive file loaded successfully!");
      setIsLoading(false);
    }
  });

  // Ensure proper sizing of the container
  useEffect(() => {
    if (containerRef.current && !isLoading && !error) {
      // Force a resize event to ensure the canvas is properly sized
      window.dispatchEvent(new Event('resize'));
    }
  }, [isLoading, error]);

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
        <div>
          <h3>Animation Error</h3>
          <p>{error}</p>
          <p style={{fontSize: '14px', marginTop: '10px'}}>
            Please try refreshing the page or view on a different browser.
          </p>
        </div>
      </div>
    );
  };

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
        <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
          Loading...
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