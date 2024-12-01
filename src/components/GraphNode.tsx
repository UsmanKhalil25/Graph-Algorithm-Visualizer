import React from "react";

interface GraphNodeProps {
  x: number;
  y: number;
  size?: number;
  children?: React.ReactNode;
}

export const GraphNode: React.FC<GraphNodeProps> = ({
  x,
  y,
  size = 50,
  children,
}) => {
  return (
    <div
      className={`absolute flex items-center justify-center rounded-full shadow-md cursor-pointer select-none bg-foreground text-background`}
      style={{
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
      }}
    >
      {children}
    </div>
  );
};
