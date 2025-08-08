import { useEffect, useRef } from 'react';

export function SimpleVideoTest() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const startVideo = async () => {
      try {
        console.log('SimpleVideoTest: Starting...');
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        
        console.log('SimpleVideoTest: Got stream:', stream);
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          console.log('SimpleVideoTest: Set srcObject');
          
          try {
            await videoRef.current.play();
            console.log('SimpleVideoTest: Video playing!');
          } catch (e) {
            console.error('SimpleVideoTest: Play failed:', e);
          }
        }
      } catch (error) {
        console.error('SimpleVideoTest: Error:', error);
      }
    };

    startVideo();
  }, []);

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      width: '300px', 
      height: '200px', 
      border: '2px solid red',
      zIndex: 9999,
      backgroundColor: 'blue'
    }}>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
    </div>
  );
}