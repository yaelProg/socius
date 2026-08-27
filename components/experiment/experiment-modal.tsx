"use client";

import { Button } from "@/components/ui/button";
import type { ExperimentConfig } from "@/lib/vs-data";

interface ExperimentModalProps {
  open: boolean;
  onClose: () => void;
  onRun: (config: ExperimentConfig) => void;
  defaultConfig: ExperimentConfig;
}

export function ExperimentModal({ open, onClose, onRun, defaultConfig }: ExperimentModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in" onClick={onClose}>
      <div
        className="w-full max-w-md bg-card rounded-2xl border border-border shadow-2xl p-6 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-2">Run Experiment</h2>
        <p className="text-sm text-muted-foreground mb-6">
          This will simulate {defaultConfig.duration} days with the current configuration and show you the results.
        </p>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Population</span>
            <span className="font-medium">{defaultConfig.populationSize}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Duration</span>
            <span className="font-medium">{defaultConfig.duration} days</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Difficulty</span>
            <span className="font-medium capitalize">{defaultConfig.difficulty}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              onRun(defaultConfig);
              onClose();
            }}
          >
            Run Experiment
          </Button>
        </div>
      </div>
    </div>
  );
}
