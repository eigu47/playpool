import { Vector3 } from "three";

const FIXED_POS = [
  [0, 0.05, 0.55], // 0
  [0, 0.05, -0.64], // 8
] as const;

const RANDOM_POS = [
  [0, 0.05, -0.55],
  [0.026, 0.05, -0.595],
  [-0.026, 0.05, -0.595],
  [0.052, 0.05, -0.64],
  [-0.052, 0.05, -0.64],
  [0.026, 0.05, -0.685],
  [-0.026, 0.05, -0.685],
  [0.078, 0.05, -0.685],
  [-0.078, 0.05, -0.685],
  [0, 0.05, -0.73],
  [0.052, 0.05, -0.73],
  [-0.052, 0.05, -0.73],
  [0.104, 0.05, -0.73],
  [-0.104, 0.05, -0.73],
] as const;

export function shuffleArray<T>(indexes: T[]) {
  for (let i = indexes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
  }
  return indexes;
}

export function getInitialPositions(): Vector3[] {
  const copyPos = [...RANDOM_POS];
  const shuffled = shuffleArray(copyPos);

  return [
    FIXED_POS[0],
    ...shuffled.slice(0, 7),
    FIXED_POS[1],
    ...shuffled.slice(7),
  ].map((pos) => new Vector3(...pos));
}

export const BALLS: {
  id: number;
  type: "white" | "black" | "solid" | "stripe";
}[] = [
  {
    id: 0,
    type: "white",
  },
  {
    id: 1,
    type: "solid",
  },
  {
    id: 2,
    type: "solid",
  },
  {
    id: 3,
    type: "solid",
  },
  {
    id: 4,
    type: "solid",
  },
  {
    id: 5,
    type: "solid",
  },
  {
    id: 6,
    type: "solid",
  },
  {
    id: 7,
    type: "solid",
  },
  {
    id: 8,
    type: "black",
  },
  {
    id: 9,
    type: "stripe",
  },
  {
    id: 10,
    type: "stripe",
  },
  {
    id: 11,
    type: "stripe",
  },
  {
    id: 12,
    type: "stripe",
  },
  {
    id: 13,
    type: "stripe",
  },
  {
    id: 14,
    type: "stripe",
  },
  {
    id: 15,
    type: "stripe",
  },
];
