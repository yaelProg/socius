"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DEFAULT_CONFIG, type ExperimentConfig } from "@/lib/vs-data";
import type { CitizenRole } from "@/lib/vs-types";

interface SetupScreenProps {
  onStart: (config: ExperimentConfig) => void;
}

const ROLE_INFO: Record<CitizenRole, { label: string; desc: string; icon: string }> = {
  farmer: { label: "Farmers", desc: "Produce food to sustain the population", icon: "🌾" },
  builder: { label: "Builders", desc: "Gather wood for construction", icon: "🔨" },
  trader: { label: "Traders", desc: "Generate mixed resources through trade", icon: "💰" },
  guard: { label: "Guards", desc: "Protect the settlement from threats", icon: "🛡️" },
  scholar: { label: "Scholars", desc: "Research knowledge for breakthroughs", icon: "📚" },
};

export function SetupScreen({ onStart }: SetupScreenProps) {
  const [config, setConfig] = useState<ExperimentConfig>(DEFAULT_CONFIG);

  const totalAssigned =
    config.roles.farmer +
    config.roles.builder +
    config.roles.trader +
    config.roles.guard +
    config.roles.scholar;

  const canStart = totalAssigned === config.populationSize && config.populationSize > 0;

  const adjustRole = (role: CitizenRole, delta: number) => {
    setConfig((prev) => {
      const newCount = Math.max(0, prev.roles[role] + delta);
      const newTotal = Object.values({ ...prev.roles, [role]: newCount }).reduce((a, b) => a + b, 0);
      if (newTotal > prev.populationSize) return prev;
      return { ...prev, roles: { ...prev.roles, [role]: newCount } };
    });
  };

  const adjustPopulation = (delta: number) => {
    setConfig((prev) => {
      const newPop = Math.max(1, Math.min(20, prev.populationSize + delta));
      const roles = { ...prev.roles };
      let assigned = Object.values(roles).reduce((a, b) => a + b, 0);
      if (assigned > newPop) {
        const order: CitizenRole[] = ["scholar", "guard", "trader", "builder", "farmer"];
        for (const r of order) {
          while (roles[r] > 0 && assigned > newPop) {
            roles[r]--;
            assigned--;
          }
        }
      }
      return { ...prev, populationSize: newPop, roles };
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-2xl bg-card rounded-2xl border border-border shadow-xl p-8 animate-scale-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">IsoWorld</h1>
          <p className="text-muted-foreground">Configure your isometric society simulation</p>
        </div>

        <div className="space-y-6">
          {/* Population */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Population Size</label>
              <span className="text-2xl font-bold tabular-nums">{config.populationSize}</span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" onClick={() => adjustPopulation(-1)}>-</Button>
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${(config.populationSize / 20) * 100}%` }}
                />
              </div>
              <Button variant="outline" size="icon" onClick={() => adjustPopulation(1)}>+</Button>
            </div>
          </div>

          {/* Role Distribution */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Role Distribution</label>
              <span className={`text-xs tabular-nums ${totalAssigned === config.populationSize ? "text-success" : "text-destructive"}`}>
                {totalAssigned} / {config.populationSize} assigned
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {(Object.keys(ROLE_INFO) as CitizenRole[]).map((role) => (
                <div
                  key={role}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{ROLE_INFO[role].icon}</span>
                    <div>
                      <div className="text-sm font-medium">{ROLE_INFO[role].label}</div>
                      <div className="text-xs text-muted-foreground">{ROLE_INFO[role].desc}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => adjustRole(role, -1)}
                      disabled={config.roles[role] === 0}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center font-semibold tabular-nums">{config.roles[role]}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => adjustRole(role, 1)}
                      disabled={totalAssigned >= config.populationSize}
                    >
                      +
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Simulation Duration (days)</label>
              <span className="text-lg font-bold tabular-nums">{config.duration}</span>
            </div>
            <input
              type="range"
              min={5}
              max={60}
              step={5}
              value={config.duration}
              onChange={(e) => setConfig({ ...config, duration: Number(e.target.value) })}
              className="w-full accent-primary"
            />
          </div>

          {/* Start Button */}
          <Button
            className="w-full"
            size="lg"
            disabled={!canStart}
            onClick={() => onStart(config)}
          >
            {canStart ? "Start Simulation" : "Assign all citizens to continue"}
          </Button>
        </div>
      </div>
    </div>
  );
}
