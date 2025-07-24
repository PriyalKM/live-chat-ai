const RadialChart = ({value}) => {
  const totalSegments = 28;
  const filledSegments = Math.round((value / 100) * totalSegments);

  const radiusOuter = 70;
  const radiusInner = 58;
  const segmentWidthTop = 4;  
  const segmentWidthBottom = 2.8; 
  const centerX =100;
  const centerY =82;

  const renderSegments = () => {
    return Array.from({ length: totalSegments }).map((_, i) => {
      const angle = (Math.PI * i) / (totalSegments - 1);
      const angleOffsetTop = segmentWidthTop / radiusOuter;
      const angleOffsetBottom = segmentWidthBottom / radiusInner;

      const angleTopLeft = angle - angleOffsetTop / 2;
      const angleTopRight = angle + angleOffsetTop / 2;
      const angleBottomLeft = angle - angleOffsetBottom / 2;
      const angleBottomRight = angle + angleOffsetBottom / 2;

      // Top edge points (outer radius)
      const x1 = centerX + radiusOuter * Math.cos(angleTopLeft - Math.PI);
      const y1 = centerY + radiusOuter * Math.sin(angleTopLeft - Math.PI);
      const x2 = centerX + radiusOuter * Math.cos(angleTopRight - Math.PI);
      const y2 = centerY + radiusOuter * Math.sin(angleTopRight - Math.PI);

      // Bottom edge points (inner radius)
      const x3 = centerX + radiusInner * Math.cos(angleBottomRight - Math.PI);
      const y3 = centerY + radiusInner * Math.sin(angleBottomRight - Math.PI);
      const x4 = centerX + radiusInner * Math.cos(angleBottomLeft - Math.PI);
      const y4 = centerY + radiusInner * Math.sin(angleBottomLeft - Math.PI);

      const isFilled = i < filledSegments;
      const color = isFilled ? "#1455D2" : "#EBEBEB";

      return (
        <polygon
          key={i}
          points={`${x1},${y1} ${x2},${y2} ${x3},${y3} ${x4},${y4}`}
          fill={color}
        />
      );
    });
  };

  return (
    <div className="flex items-center justify-center">
      <svg viewBox="0 0 200 110" className="w-full h-[170px] 2xl:h-[270px]">
        {renderSegments()}
      </svg>
    </div>
  );
};

export default RadialChart;
