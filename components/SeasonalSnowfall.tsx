"use client";

import { useEffect, useState } from "react";
import Snowfall from "react-snowfall";

export default function SeasonalSnowfall() {
  const [showSnow, setShowSnow] = useState(false);

  useEffect(() => {
    const checkSnowSeason = () => {
      const now = new Date();
      const month = now.getMonth(); // 0-11 (0 = January, 11 = December)

      // Show snow during winter months: December (11), January (0), February (1)
      const isWinterSeason = month === 11 || month === 0 || month === 1;
      setShowSnow(isWinterSeason);
    };

    checkSnowSeason();

    // Check daily in case the app stays open across month boundaries
    const interval = setInterval(checkSnowSeason, 1000 * 60 * 60 * 24); // Check every 24 hours

    return () => clearInterval(interval);
  }, []);

  if (!showSnow) return null;

  return (
    <Snowfall
      color="#dee4fd"
      snowflakeCount={50}
      style={{
        position: "fixed",
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
        pointerEvents: "none",
      }}
    />
  );
}
