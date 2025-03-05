import { useState, useEffect } from 'react';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';

const RiveAnimation = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Configure Rive with better layout settings for high resolution
  const { rive, RiveComponent } = useRive({
    src: process.env.PUBLIC_URL + '/ZohebAi.riv',
    autoplay: true,
    layout: new Layout({
      fit: Fit.Contain, // Use Contain to maintain aspect ratio without cropping
      alignment: Alignment.Center,
      // Increase the scale to make it appear larger
      scale: 1.2
    }),
    onLoadError: (e) => {
      console.error("Rive file load error:", e);
      setError("The Rive file appears to be corrupted or in an invalid format.");
      setIsLoading(false);
    },
    onLoad: () => {
      console.log("Rive file loaded successfully!");
      setIsLoading(false);
    }
  });

  // Fallback image if Rive fails
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
            Try downloading a valid Rive file (.riv) from the <a href="https://rive.app/community/" target="_blank" rel="noopener noreferrer">Rive Community</a>
          </p>
        </div>
      </div>
    );
  };

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', // Use 100% height to fill the container
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      borderRadius: '8px',
      // Remove the border
      position: 'relative'
    }}>
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