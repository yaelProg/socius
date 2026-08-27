export type CitizenRole = "farmer" | "builder" | "trader" | "guard" | "scholar";

export interface Citizen {
  id: string;
  name: string;
  role: CitizenRole;
  x: number;
  y: number;
  health: number;
  happiness: number;
  productivity: number;
}

export interface Building {
  id: string;
  type: "house" | "farm" | "market" | "tower" | "library";
  gridX: number;
  gridY: number;
  width: number;
  depth: number;
  height: number;
  color: string;
  roofColor: string;
}

export interface Prop {
  id: string;
  type: "tree" | "rock" | "bush" | "flower" | "path";
  gridX: number;
  gridY: number;
}

export interface WorldState {
  citizens: Citizen[];
  buildings: Building[];
  props: Prop[];
  gridWidth: number;
  gridDepth: number;
  resources: {
    food: number;
    wood: number;
    stone: number;
    knowledge: number;
  };
  day: number;
  population: number;
}

export interface ExperimentConfig {
  populationSize: number;
  initialResources: {
    food: number;
    wood: number;
    stone: number;
  };
  roles: {
    farmer: number;
    builder: number;
    trader: number;
    guard: number;
    scholar: number;
  };
  duration: number;
  difficulty: "easy" | "normal" | "hard";
}

export interface ExperimentResult {
  day: number;
  population: number;
  food: number;
  wood: number;
  stone: number;
  knowledge: number;
  happiness: number;
  events: string[];
}

export type GamePhase = "setup" | "generating" | "playing" | "results";
