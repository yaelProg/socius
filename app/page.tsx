"use client";

import { useState, useCallback } from "react";
import { SetupScreen } from "@/components/setup/setup-screen";
import { GeneratingScreen } from "@/components/setup/generating-screen";
import { IsoWorld } from "@/components/world/iso-world";
import { ExperimentModal } from "@/components/experiment/experiment-modal";
import { ResultsOverlay } from "@/components/experiment/results-overlay";
import { Button } from "@/components/ui/button";
import { generateWorld, simulateDay, runExperiment, DEFAULT_CONFIG } from "@/lib/vs-data";
import type { ExperimentConfig, ExperimentResult, WorldState, GamePhase } from "@/lib/vs-types";

export default function Home() {
  const [phase, setPhase] = useState<GamePhase>("setup");
  const [config, setConfig] = useState<ExperimentConfig>(DEFAULT_CONFIG);
  const [world, setWorld] = useState<WorldState | null>(null);
  const [selectedCitizenId, setSelectedCitizenId] = useState<string>("");
  const [showExperiment, setShowExperiment] = useState(false);
  const [results, setResults] = useState<ExperimentResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleStart = useCallback((cfg: ExperimentConfig) => {
    setConfig(cfg);
    setPhase("generating");
  }, []);

  const handleGenerateComplete = useCallback(() => {
    setWorld(generateWorld(config));
    setPhase("playing");
  }, [config]);

  const handleNextDay = useCallback(() => {
    setWorld((prev) => (prev ? simulateDay(prev) : prev));
  }, []);

  const handleRunExperiment = useCallback((cfg: ExperimentConfig) => {
    const res = runExperiment(cfg);
    setResults(res);
    setShowResults(true);
  }, []);

  const handleReset = useCallback(() => {
    setWorld(null);
    setSelectedCitizenId("");
    setResults([]);
    setShowResults(false);
    setPhase("setup");
  }, []);

  if (phase === "setup") {
    return <SetupScreen onStart={handleStart} />;
  }

  if (phase === "generating") {
    return <GeneratingScreen onComplete={handleGenerateComplete} />;
  }

  if (phase === "playing" && world) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold">IsoWorld</h1>
            <div className="flex items-center gap-3 text-sm">
              <ResourceChip label="Day" value={world.day} color="var(--foreground)" />
              <ResourceChip label="Pop" value={world.population} color="#60a5fa" />
              <ResourceChip label="Food" value={Math.round(world.resources.food)} color="#4ade80" />
              <ResourceChip label="Wood" value={Math.round(world.resources.wood)} color="#fbbf24" />
              <ResourceChip label="Stone" value={Math.round(world.resources.stone)} color="#a3a3a3" />
              <ResourceChip label="Knowledge" value={Math.round(world.resources.knowledge)} color="#c084fc" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleNextDay}>
              Next Day
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setShowExperiment(true)}>
              Experiment
            </Button>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </header>

        {/* World view */}
        <main className="flex-1 relative">
          <IsoWorld
            world={world}
            selectedCitizenId={selectedCitizenId || undefined}
            onSelectCitizen={setSelectedCitizenId}
          />
        </main>

        <ExperimentModal
          open={showExperiment}
          onClose={() => setShowExperiment(false)}
          onRun={handleRunExperiment}
          defaultConfig={config}
        />

        <ResultsOverlay
          open={showResults}
          results={results}
          onClose={() => setShowResults(false)}
        />
      </div>
    );
  }

  return null;
}

function ResourceChip({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50">
      <div className="w-2 h-2 rounded-full" style={{ background: color }} />
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold tabular-nums">{value}</span>
    </div>
  );
}
