"use client";

import { Button } from "@/components/ui/button";
import type { ExperimentResult } from "@/lib/vs-types";

interface ResultsOverlayProps {
  open: boolean;
  results: ExperimentResult[];
  onClose: () => void;
}

export function ResultsOverlay({ open, results, onClose }: ResultsOverlayProps) {
  if (!open || results.length === 0) return null;

  const maxFood = Math.max(...results.map((r) => r.food), 1);
  const maxWood = Math.max(...results.map((r) => r.wood), 1);
  const maxStone = Math.max(...results.map((r) => r.stone), 1);
  const maxKnowledge = Math.max(...results.map((r) => r.knowledge), 1);

  const final = results[results.length - 1];
  const initial = results[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-fade-in p-4" onClick={onClose}>
      <div
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-card rounded-2xl border border-border shadow-2xl p-6 animate-scale-in scrollbar-thin"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Experiment Results</h2>
            <p className="text-sm text-muted-foreground">{results.length} days simulated</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            &times;
          </Button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <SummaryCard label="Food" value={final.food} delta={final.food - initial.food} color="#4ade80" />
          <SummaryCard label="Wood" value={final.wood} delta={final.wood - initial.wood} color="#fbbf24" />
          <SummaryCard label="Stone" value={final.stone} delta={final.stone - initial.stone} color="#888888" />
          <SummaryCard label="Knowledge" value={final.knowledge} delta={final.knowledge - initial.knowledge} color="#c084fc" />
        </div>

        {/* Charts */}
        <div className="space-y-4 mb-6">
          <ChartRow label="Food" data={results.map((r) => r.food)} max={maxFood} color="#4ade80" />
          <ChartRow label="Wood" data={results.map((r) => r.wood)} max={maxWood} color="#fbbf24" />
          <ChartRow label="Stone" data={results.map((r) => r.stone)} max={maxStone} color="#888888" />
          <ChartRow label="Knowledge" data={results.map((r) => r.knowledge)} max={maxKnowledge} color="#c084fc" />
        </div>

        {/* Events */}
        {results.some((r) => r.events.length > 0) && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-2">Notable Events</h3>
            <div className="space-y-1 max-h-32 overflow-y-auto scrollbar-thin">
              {results.filter((r) => r.events.length > 0).map((r) => (
                <div key={r.day} className="text-xs text-muted-foreground">
                  <span className="font-medium">Day {r.day}:</span> {r.events.join(", ")}
                </div>
              ))}
            </div>
          </div>
        )}

        <Button className="w-full" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, delta, color }: { label: string; value: number; delta: number; color: string }) {
  const positive = delta >= 0;
  return (
    <div className="p-3 rounded-lg border border-border bg-background/50">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 rounded-full" style={{ background: color }} />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <div className="text-lg font-bold tabular-nums">{value}</div>
      <div className={`text-xs tabular-nums ${positive ? "text-success" : "text-destructive"}`}>
        {positive ? "+" : ""}{delta}
      </div>
    </div>
  );
}

function ChartRow({ label, data, max, color }: { label: string; data: number[]; max: number; color: string }) {
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - (v / max) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-muted-foreground w-16 shrink-0">{label}</span>
      <div className="flex-1 h-10 relative">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </div>
  );
}
