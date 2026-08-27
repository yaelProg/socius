"use client";

import type { Citizen } from "@/lib/vs-types";
import { cn } from "@/lib/utils";

interface CitizenPanelProps {
  citizen?: Citizen;
  onClose: () => void;
}

export function CitizenPanel({ citizen, onClose }: CitizenPanelProps) {
  if (!citizen) return null;

  const roleColors: Record<string, string> = {
    farmer: "#4ade80",
    builder: "#fbbf24",
    trader: "#60a5fa",
    guard: "#f87171",
    scholar: "#c084fc",
  };

  const color = roleColors[citizen.role] || "#888";

  return (
    <div className="absolute bottom-4 right-4 w-64 bg-card border border-border rounded-lg shadow-xl p-4 animate-slide-up">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ background: color }} />
          <h3 className="font-semibold text-sm">{citizen.name}</h3>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors text-lg leading-none"
        >
          &times;
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground capitalize">{citizen.role}</span>
        </div>

        <StatBar label="Health" value={citizen.health} color="#4ade80" />
        <StatBar label="Happiness" value={citizen.happiness} color="#fbbf24" />
        <StatBar label="Productivity" value={citizen.productivity} color="#60a5fa" />
      </div>
    </div>
  );
}

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{Math.round(value)}</span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500")}
          style={{ width: `${value}%`, background: color }}
        />
      </div>
    </div>
  );
}
