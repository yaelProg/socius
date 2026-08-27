"use client";

import { TILE_WIDTH, TILE_HEIGHT } from "@/lib/vs-iso";

interface IsoBuildingProps {
  gridX: number;
  gridY: number;
  width: number;
  depth: number;
  height: number;
  color: string;
  roofColor: string;
  type: string;
}

export function IsoBuilding({
  gridX,
  gridY,
  width,
  depth,
  height,
  color,
  roofColor,
  type,
}: IsoBuildingProps) {
  const screenX = (gridX - gridY) * (TILE_WIDTH / 2);
  const screenY = (gridX + gridY) * (TILE_HEIGHT / 2);

  const w = width * TILE_WIDTH;
  const d = depth * TILE_WIDTH;
  const h = height * TILE_HEIGHT;

  const halfW = w / 2;
  const halfD = d / 2;

  const topFace = `${screenX},${screenY - h} ${screenX + halfW},${screenY - h + halfD / 2} ${screenX},${screenY - h + halfD} ${screenX - halfW},${screenY - h + halfD / 2}`;
  const leftFace = `${screenX - halfW},${screenY - h + halfD / 2} ${screenX},${screenY - h + halfD} ${screenX},${screenY + halfD} ${screenX - halfW},${screenY + halfD / 2}`;
  const rightFace = `${screenX},${screenY - h + halfD} ${screenX + halfW},${screenY - h + halfD / 2} ${screenX + halfW},${screenY + halfD / 2} ${screenX},${screenY + halfD}`;

  const roofTop = `${screenX},${screenY - h - 10} ${screenX + halfW + 8},${screenY - h + halfD / 2 - 10} ${screenX},${screenY - h + halfD - 10} ${screenX - halfW - 8},${screenY - h + halfD / 2 - 10}`;

  return (
    <g style={{ pointerEvents: "none" }}>
      <polygon points={leftFace} fill={color} opacity={0.85} stroke="rgba(0,0,0,0.15)" strokeWidth={0.5} />
      <polygon points={rightFace} fill={color} opacity={0.7} stroke="rgba(0,0,0,0.15)" strokeWidth={0.5} />
      <polygon points={topFace} fill={color} opacity={0.95} />
      <polygon points={roofTop} fill={roofColor} opacity={0.9} stroke="rgba(0,0,0,0.2)" strokeWidth={0.5} />
      {type === "tower" && (
        <circle cx={screenX} cy={screenY - h - 14} r={3} fill={roofColor} opacity={0.6} />
      )}
    </g>
  );
}
