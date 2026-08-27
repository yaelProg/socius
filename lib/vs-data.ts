import type {
  Citizen,
  CitizenRole,
  Building,
  Prop,
  WorldState,
  ExperimentConfig,
  ExperimentResult,
} from "./vs-types";

export type { ExperimentConfig, ExperimentResult, WorldState };

const CITIZEN_NAMES = [
  "Aria", "Bram", "Cora", "Dorn", "Elin", "Fenn", "Greta", "Hale",
  "Iris", "Jorn", "Kael", "Lina", "Maren", "Nori", "Orin", "Pell",
  "Quin", "Rosa", "Soren", "Tara", "Ulla", "Venn", "Wren", "Yara",
];

const ROLE_COLORS: Record<CitizenRole, string> = {
  farmer: "#4ade80",
  builder: "#fbbf24",
  trader: "#60a5fa",
  guard: "#f87171",
  scholar: "#c084fc",
};

const BUILDING_COLORS = {
  house: { wall: "#d4a574", roof: "#a0522d" },
  farm: { wall: "#8bb86f", roof: "#5a7d3a" },
  market: { wall: "#c4a0d4", roof: "#7d4a9a" },
  tower: { wall: "#a0a0b8", roof: "#4a4a6a" },
  library: { wall: "#b8c4e0", roof: "#4a5a8a" },
};

export function generateWorld(config: ExperimentConfig): WorldState {
  const gridWidth = 12;
  const gridDepth = 12;

  const citizens: Citizen[] = [];
  const { farmer, builder, trader, guard, scholar } = config.roles;
  const roleDistribution: CitizenRole[] = [
    ...Array(farmer).fill("farmer"),
    ...Array(builder).fill("builder"),
    ...Array(trader).fill("trader"),
    ...Array(guard).fill("guard"),
    ...Array(scholar).fill("scholar"),
  ];

  for (let i = 0; i < config.populationSize; i++) {
    const role = roleDistribution[i % roleDistribution.length] || "farmer";
    citizens.push({
      id: `citizen-${i}`,
      name: CITIZEN_NAMES[i % CITIZEN_NAMES.length],
      role,
      x: Math.random() * gridWidth,
      y: Math.random() * gridDepth,
      health: 80 + Math.random() * 20,
      happiness: 60 + Math.random() * 40,
      productivity: 50 + Math.random() * 50,
    });
  }

  const buildings: Building[] = [
    {
      id: "b-house-1",
      type: "house",
      gridX: 2,
      gridY: 2,
      width: 2,
      depth: 2,
      height: 1.5,
      color: BUILDING_COLORS.house.wall,
      roofColor: BUILDING_COLORS.house.roof,
    },
    {
      id: "b-farm-1",
      type: "farm",
      gridX: 6,
      gridY: 2,
      width: 3,
      depth: 2,
      height: 0.8,
      color: BUILDING_COLORS.farm.wall,
      roofColor: BUILDING_COLORS.farm.roof,
    },
    {
      id: "b-market-1",
      type: "market",
      gridX: 2,
      gridY: 6,
      width: 2,
      depth: 2,
      height: 1.2,
      color: BUILDING_COLORS.market.wall,
      roofColor: BUILDING_COLORS.market.roof,
    },
    {
      id: "b-tower-1",
      type: "tower",
      gridX: 8,
      gridY: 7,
      width: 1,
      depth: 1,
      height: 3,
      color: BUILDING_COLORS.tower.wall,
      roofColor: BUILDING_COLORS.tower.roof,
    },
    {
      id: "b-library-1",
      type: "library",
      gridX: 5,
      gridY: 8,
      width: 2,
      depth: 2,
      height: 1.8,
      color: BUILDING_COLORS.library.wall,
      roofColor: BUILDING_COLORS.library.roof,
    },
  ];

  const props: Prop[] = [];
  for (let i = 0; i < 8; i++) {
    props.push({
      id: `p-tree-${i}`,
      type: "tree",
      gridX: Math.random() * gridWidth,
      gridY: Math.random() * gridDepth,
    });
  }
  for (let i = 0; i < 5; i++) {
    props.push({
      id: `p-bush-${i}`,
      type: "bush",
      gridX: Math.random() * gridWidth,
      gridY: Math.random() * gridDepth,
    });
  }
  for (let i = 0; i < 3; i++) {
    props.push({
      id: `p-rock-${i}`,
      type: "rock",
      gridX: Math.random() * gridWidth,
      gridY: Math.random() * gridDepth,
    });
  }

  return {
    citizens,
    buildings,
    props,
    gridWidth,
    gridDepth,
    resources: {
      food: config.initialResources.food,
      wood: config.initialResources.wood,
      stone: config.initialResources.stone,
      knowledge: 10,
    },
    day: 1,
    population: config.populationSize,
  };
}

export function simulateDay(state: WorldState): WorldState {
  const newState = { ...state, resources: { ...state.resources } };

  let foodProduction = 0;
  let woodProduction = 0;
  let stoneProduction = 0;
  let knowledgeProduction = 0;

  for (const citizen of state.citizens) {
    const efficiency = (citizen.productivity / 100) * (citizen.happiness / 100);
    switch (citizen.role) {
      case "farmer":
        foodProduction += 5 * efficiency;
        break;
      case "builder":
        woodProduction += 3 * efficiency;
        break;
      case "trader":
        foodProduction += 1 * efficiency;
        woodProduction += 1 * efficiency;
        stoneProduction += 1 * efficiency;
        break;
      case "guard":
        break;
      case "scholar":
        knowledgeProduction += 4 * efficiency;
        break;
    }
  }

  const difficultyMultiplier = 1;
  newState.resources.food = Math.max(0, newState.resources.food + foodProduction - state.population * 1.5);
  newState.resources.wood = Math.max(0, newState.resources.wood + woodProduction);
  newState.resources.stone = Math.max(0, newState.resources.stone + stoneProduction);
  newState.resources.knowledge = Math.max(0, newState.resources.knowledge + knowledgeProduction);

  newState.day = state.day + 1;

  const avgHappiness = state.citizens.reduce((sum, c) => sum + c.happiness, 0) / state.citizens.length;
  if (newState.resources.food < state.population) {
    newState.citizens = state.citizens.map((c) => ({
      ...c,
      health: Math.max(0, c.health - 5),
      happiness: Math.max(0, c.happiness - 3),
    }));
  } else {
    newState.citizens = state.citizens.map((c) => ({
      ...c,
      health: Math.min(100, c.health + 1),
      happiness: Math.min(100, c.happiness + (avgHappiness > 70 ? 2 : -1)),
    }));
  }

  return newState;
}

export function runExperiment(config: ExperimentConfig): ExperimentResult[] {
  let state = generateWorld(config);
  const results: ExperimentResult[] = [];

  for (let day = 0; day < config.duration; day++) {
    const avgHappiness = state.citizens.reduce((sum, c) => sum + c.happiness, 0) / state.citizens.length;
    const events: string[] = [];

    if (state.resources.food < state.population) {
      events.push("Food shortage detected");
    }
    if (avgHappiness < 30) {
      events.push("Citizens are unhappy");
    }
    if (state.resources.knowledge > 50) {
      events.push("Scholarly breakthrough!");
    }

    results.push({
      day: state.day,
      population: state.population,
      food: Math.round(state.resources.food),
      wood: Math.round(state.resources.wood),
      stone: Math.round(state.resources.stone),
      knowledge: Math.round(state.resources.knowledge),
      happiness: Math.round(avgHappiness),
      events,
    });

    state = simulateDay(state);
  }

  return results;
}

export function getRoleColor(role: CitizenRole): string {
  return ROLE_COLORS[role];
}

export const DEFAULT_CONFIG: ExperimentConfig = {
  populationSize: 8,
  initialResources: {
    food: 50,
    wood: 30,
    stone: 20,
  },
  roles: {
    farmer: 3,
    builder: 2,
    trader: 1,
    guard: 1,
    scholar: 1,
  },
  duration: 30,
  difficulty: "normal",
};
