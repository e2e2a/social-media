import React, { useState, useEffect } from 'react';

const VerificationTimer = ({ initialSeconds }: { initialSeconds: number }) => {
  const [secondsRemaining, setSecondsRemaining] = useState(initialSeconds);

  useEffect(() => {
    if (secondsRemaining <= 0) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prevSeconds) => prevSeconds - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsRemaining]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className='flex items-center justify-center'>
      <div className='text-center rounded-md mb-[3%] sm:text-3xl text-xl font-medium'>
        {formatTime(secondsRemaining)}
      </div>
    </div>
  );
};

export default VerificationTimer;
