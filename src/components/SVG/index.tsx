import React, { useEffect, useState } from "react";
import "./index.scss";

interface SVGProps extends React.SVGProps<SVGSVGElement> {
  name: string;
  cursor?: "pointer" | "default";
  width?: string | number;
  height?: string | number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

const SVG: React.FC<SVGProps> = ({
  name,
  width = "1.5em",
  height = "1.5em",
  className,
  style,
  cursor = "default",
  color,
  ...props
}) => {
  const [svgWidth, setSvgWidth] = useState(width);
  const [svgHeight, setSvgHeight] = useState(height);

  useEffect(() => {
    setSvgWidth(typeof width === "number" ? `${width}px` : width);
    setSvgHeight(typeof height === "number" ? `${height}px` : height);
  }, [width, height]);

  return (
    <svg
      className={`svg ${className}`}
      width={svgWidth}
      height={svgHeight}
      style={{ cursor, color, ...style }}
      {...props}
    >
      <use xlinkHref={`#${name}`} />
    </svg>
  );
};

export default SVG;
