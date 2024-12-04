interface GraphEdgeProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  weight: number;
  isSelfEdge: boolean;
}

export function GraphEdge({
  x1,
  y1,
  x2,
  y2,
  weight,
  isSelfEdge,
}: GraphEdgeProps) {
  const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  return (
    <div className="relative">
      {isSelfEdge ? (
        // Draw loop for self-edge
        <div
          className="absolute bg-transparent"
          style={{
            left: x1 - 40,
            top: y1 - 40,
            width: 35,
            height: 35,
            borderRadius: "50%",
            border: "2px solid white",
          }}
        />
      ) : (
        <div
          className="absolute bg-primary"
          style={{
            left: x1,
            top: y1,
            width: length,
            height: 2,
            transform: `rotate(${angle}deg)`,
            transformOrigin: "0 50%",
          }}
        />
      )}

      <div
        className="absolute text-sm text-white"
        style={{
          left: isSelfEdge ? midX - 50 : midX - 25,
          top: isSelfEdge ? midY - 50 : midY - 25,
        }}
      >
        {weight}
      </div>
    </div>
  );
}
