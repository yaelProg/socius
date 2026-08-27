"use client";

import { useEffect, useState } from "react";

interface GeneratingScreenProps {
  onComplete: () => void;
}

const STEPS = [
  "Generating terrain...",
  "Placing buildings...",
  "Growing vegetation...",
  "Populating citizens...",
  "Initializing simulation...",
];

export function GeneratingScreen({ onComplete }: GeneratingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep >= STEPS.length) {
      const timer = setTimeout(onComplete, 300);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => setCurrentStep((s) => s + 1), 500);
    return () => clearTimeout(timer);
  }, [currentStep, onComplete]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-6">
      <div className="relative">
        <div className="w-20 h-20 rounded-full border-4 border-muted border-t-primary animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-primary/20 animate-pulse-glow" />
        </div>
      </div>

      <div className="space-y-2 text-center">
        <h2 className="text-xl font-semibold">Building your world</h2>
        <div className="space-y-1">
          {STEPS.map((step, i) => (
            <div
              key={step}
              className={`text-sm transition-all ${
                i < currentStep
                  ? "text-success"
                  : i === currentStep
                  ? "text-foreground"
                  : "text-muted-foreground/40"
              }`}
            >
              {i < currentStep && "✓ "}
              {step}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
