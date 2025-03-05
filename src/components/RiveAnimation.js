import { useState, useEffect, useRef } from 'react';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';

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
    
    // Check on initial load
    checkMobile();
    
    // Check on resize
    const handleResize = () => {
      checkMobile();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Configure Rive with better layout settings for high resolution
  const { rive, RiveComponent } = useRive({
    src: process.env.PUBLIC_URL + '/ZohebAi.riv',
    autoplay: true,
    layout: new Layout({
      fit: isMobile ? Fit.Cover : Fit.Contain, // Use Cover for mobile to ensure it fills the space
      alignment: Alignment.Center,
      // Adjust scale based on device
      scale: isMobile ? 1.0 : 1.2
    }),
    // Enable touch interactions for mobile
    isTouchScrollEnabled: true,
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

  // Apply canvas size adjustments when the component mounts or when rive instance changes
  useEffect(() => {
    if (rive && containerRef.current) {
      // Force a resize event to ensure the canvas is properly sized
      window.dispatchEvent(new Event('resize'));
      
      // For mobile devices, ensure the canvas is properly sized
      if (isMobile) {
        const canvas = containerRef.current.querySelector('canvas');
        if (canvas) {
          canvas.style.width = '100%';
          canvas.style.height = '100%';
          // Force the canvas to redraw
          rive.layout && rive.layout.updateLayout();
        }
      }
    }
  }, [rive, isMobile]);

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
        position: 'relative',
        // Add touch-action for better mobile interaction
        touchAction: 'none'
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