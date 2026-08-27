"use client";

import { useMemo } from "react";
import { TILE_WIDTH, TILE_HEIGHT } from "@/lib/vs-iso";
import type { WorldState } from "@/lib/vs-types";
import { IsoBuilding } from "./iso-building";
import { IsoProp } from "./iso-prop";
import { CitizenPanel } from "./citizen-panel";

interface IsoWorldProps {
  world: WorldState;
  selectedCitizenId?: string;
  onSelectCitizen?: (id: string) => void;
}

export function IsoWorld({ world, selectedCitizenId, onSelectCitizen }: IsoWorldProps) {
  const renderItems = useMemo(() => {
    const items: Array<{ key: string; sortKey: number; element: React.ReactNode }> = [];

    for (const building of world.buildings) {
      items.push({
        key: building.id,
        sortKey: building.gridX + building.gridY + building.width + building.depth,
        element: (
          <IsoBuilding
            gridX={building.gridX}
            gridY={building.gridY}
            width={building.width}
            depth={building.depth}
            height={building.height}
            color={building.color}
            roofColor={building.roofColor}
            type={building.type}
          />
        ),
      });
    }

    for (const prop of world.props) {
      items.push({
        key: prop.id,
        sortKey: prop.gridX + prop.gridY,
        element: <IsoProp gridX={prop.gridX} gridY={prop.gridY} type={prop.type} />,
      });
    }

    for (const citizen of world.citizens) {
      items.push({
        key: citizen.id,
        sortKey: citizen.x + citizen.y,
        element: (
          <CitizenDot
            gridX={citizen.x}
            gridY={citizen.y}
            color={getRoleColor(citizen.role)}
            selected={citizen.id === selectedCitizenId}
            onClick={() => onSelectCitizen?.(citizen.id)}
          />
        ),
      });
    }

    return items.sort((a, b) => a.sortKey - b.sortKey);
  }, [world, selectedCitizenId, onSelectCitizen]);

  const gridOffsetX = (world.gridWidth * TILE_WIDTH) / 2 + 100;
  const gridOffsetY = 50;

  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid meet"
        className="select-none"
      >
        <defs>
          <linearGradient id="ground-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7cb342" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#558b2f" stopOpacity={0.3} />
          </linearGradient>
        </defs>

        <g transform={`translate(${gridOffsetX}, ${gridOffsetY})`}>
          {/* Ground tiles */}
          {Array.from({ length: world.gridDepth }).map((_, dy) =>
            Array.from({ length: world.gridWidth }).map((_, dx) => {
              const sx = (dx - dy) * (TILE_WIDTH / 2);
              const sy = (dx + dy) * (TILE_HEIGHT / 2);
              const points = `${sx},${sy} ${sx + TILE_WIDTH / 2},${sy + TILE_HEIGHT / 2} ${sx},${sy + TILE_HEIGHT} ${sx - TILE_WIDTH / 2},${sy + TILE_HEIGHT / 2}`;
              const isEven = (dx + dy) % 2 === 0;
              return (
                <polygon
                  key={`tile-${dx}-${dy}`}
                  points={points}
                  fill={isEven ? "#8bc34a" : "#7cb342"}
                  opacity={0.4}
                  stroke="rgba(0,0,0,0.05)"
                  strokeWidth={0.5}
                />
              );
            })
          )}

          {/* Render sorted items */}
          {renderItems.map((item) => (
            <g key={item.key}>{item.element}</g>
          ))}
        </g>
      </svg>

      {selectedCitizenId && (
        <CitizenPanel
          citizen={world.citizens.find((c) => c.id === selectedCitizenId)}
          onClose={() => onSelectCitizen?.("")}
        />
      )}
    </div>
  );
}

function getRoleColor(role: string): string {
  const colors: Record<string, string> = {
    farmer: "#4ade80",
    builder: "#fbbf24",
    trader: "#60a5fa",
    guard: "#f87171",
    scholar: "#c084fc",
  };
  return colors[role] || "#888";
}

function CitizenDot({
  gridX,
  gridY,
  color,
  selected,
  onClick,
}: {
  gridX: number;
  gridY: number;
  color: string;
  selected: boolean;
  onClick: () => void;
}) {
  const screenX = (gridX - gridY) * (TILE_WIDTH / 2);
  const screenY = (gridX + gridY) * (TILE_HEIGHT / 2);

  return (
    <g style={{ cursor: "pointer" }} onClick={onClick}>
      {selected && (
        <circle cx={screenX} cy={screenY - 4} r={10} fill="none" stroke="#fff" strokeWidth={2} opacity={0.6}>
          <animate attributeName="r" values="8;14;8" dur="1.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1.5s" repeatCount="indefinite" />
        </circle>
      )}
      <ellipse cx={screenX} cy={screenY + 2} rx={4} ry={2} fill="rgba(0,0,0,0.2)" />
      <circle cx={screenX} cy={screenY - 4} r={4} fill={color} stroke="rgba(0,0,0,0.3)" strokeWidth={0.5} />
      <circle cx={screenX} cy={screenY - 6} r={2.5} fill={color} opacity={0.8} />
    </g>
  );
}
