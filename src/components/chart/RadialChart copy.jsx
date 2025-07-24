import { Users } from "lucide-react";

export default function RadialChart() {
  const totalSegments = 30;
  const value = 68;
  const filledSegments = Math.round((value / 100) * totalSegments);

  const renderSegments = () => {
    const radiusOuter = 180;
    const radiusInner = 145;
    const centerX = 0;
    const centerY = 0;
    const segmentWidthTop = 6;  
    const segmentWidthBottom = 2;

    return Array.from({ length: totalSegments }).map((_, i) => {
      const angle = (Math.PI * i) / (totalSegments - 1);
      const x1 = centerX + radiusOuter * Math.cos(angle - Math.PI);
      const y1 = centerY + radiusOuter * Math.sin(angle - Math.PI);
      const x2 = centerX + radiusInner * Math.cos(angle - Math.PI);
      const y2 = centerY + radiusInner * Math.sin(angle - Math.PI);


      return (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={i < filledSegments ? "#1D4ED8" : "#E5E7EB"}
          strokeWidth="8"
        // strokeLinecap="round"
        />
      );
    });
  };

  return (

    <div className="h-[120px]">
      <svg
        viewBox="0 0 200 100"
        className="w-full h-full overflow-visible"
      >
        {renderSegments()}
      </svg>
    </div>
  );
}
