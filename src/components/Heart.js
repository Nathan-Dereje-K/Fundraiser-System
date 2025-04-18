import React, { useEffect, useState } from "react";
import "./Heartbeat.css";

const Heart = ({ onAnimationEnd }) => {
  const [fillScreen, setFillScreen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFillScreen(true);
      setTimeout(onAnimationEnd, 1000); // Call onAnimationEnd after 1 second
    }, 3000);

    return () => clearTimeout(timer);
  }, [onAnimationEnd]);

  return (
    <div className={`heart ${fillScreen ? "fill-screen" : ""}`} />
  );
};

export default Heart;
