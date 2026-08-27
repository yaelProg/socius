"use client";

import { TILE_WIDTH, TILE_HEIGHT } from "@/lib/vs-iso";

interface IsoPropProps {
  gridX: number;
  gridY: number;
  type: string;
}

export function IsoProp({ gridX, gridY, type }: IsoPropProps) {
  const screenX = (gridX - gridY) * (TILE_WIDTH / 2);
  const screenY = (gridX + gridY) * (TILE_HEIGHT / 2);

  if (type === "tree") {
    return (
      <g style={{ pointerEvents: "none" }}>
        <rect x={screenX - 2} y={screenY - 12} width={4} height={14} fill="#6b4423" rx={1} />
        <circle cx={screenX} cy={screenY - 18} r={10} fill="#3a7d2c" opacity={0.9} />
        <circle cx={screenX - 4} cy={screenY - 22} r={7} fill="#4a9d3c" opacity={0.85} />
        <circle cx={screenX + 4} cy={screenY - 20} r={6} fill="#3a7d2c" opacity={0.8} />
      </g>
    );
  }

  if (type === "rock") {
    return (
      <g style={{ pointerEvents: "none" }}>
        <ellipse cx={screenX} cy={screenY} rx={8} ry={4} fill="#888888" opacity={0.7} />
        <ellipse cx={screenX - 2} cy={screenY - 3} rx={5} ry={3} fill="#999999" opacity={0.6} />
      </g>
    );
  }

  if (type === "bush") {
    return (
      <g style={{ pointerEvents: "none" }}>
        <ellipse cx={screenX} cy={screenY} rx={6} ry={3} fill="#4a7d3a" opacity={0.8} />
        <ellipse cx={screenX - 2} cy={screenY - 2} rx={4} ry={2.5} fill="#5a8d4a" opacity={0.75} />
      </g>
    );
  }

  return null;
}
