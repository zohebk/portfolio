import { useState, useEffect } from 'react';
import { useRive } from '@rive-app/react-canvas';

const RiveAnimation = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  // Simple mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Use a very simple Rive configuration
  const { RiveComponent } = useRive({
    src: process.env.PUBLIC_URL + '/ZohebAi.riv',
    stateMachines: "State Machine 1", // Try using a state machine if available
    autoplay: true,
    onLoadError: (e) => {
      console.error("Rive file load error:", e);
      setError("The animation couldn't be loaded on this device.");
      setIsLoading(false);
    },
    onLoad: () => {
      console.log("Rive file loaded successfully!");
      setIsLoading(false);
    }
  });

  // Fallback content for mobile or when Rive fails
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
          <h3>Animation Not Available</h3>
          <p>{error || "The animation is not available on mobile devices."}</p>
          <p style={{fontSize: '14px', marginTop: '10px'}}>
            Please view on a desktop browser for the full experience.
          </p>
        </div>
      </div>
    );
  };

  // For mobile devices, just show the fallback content
  if (isMobile) {
    return renderFallbackContent();
  }

  return (
    <div style={{ 
      width: '100%', 
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      borderRadius: '8px',
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