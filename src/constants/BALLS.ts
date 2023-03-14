import { Vector3 } from "three";

const FIXED_POS = [
  [0, 0.052, 1.15], // 0
  [0, 0.052, -1.33], // 8
] as const;

const RANDOM_POS = [
  // 0
  [0, 0.052, -1.15],
  [0.052, 0.052, -1.24],
  [-0.052, 0.052, -1.24],
  [0.104, 0.052, -1.33],
  [-0.104, 0.052, -1.33],
  [0.052, 0.052, -1.42],
  [-0.052, 0.052, -1.42],
  // 8
  [0.156, 0.052, -1.42],
  [-0.156, 0.052, -1.42],
  [0, 0.052, -1.51],
  [0.104, 0.052, -1.51],
  [-0.104, 0.052, -1.51],
  [0.208, 0.052, -1.51],
  [-0.208, 0.052, -1.51],
] as const;

export function shuffleArray<T>(indexes: T[]): T[] {
  for (let i = indexes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    const [ii, jj] = [indexes[i], indexes[j]];
    if (ii != undefined && jj != undefined) {
      [indexes[i], indexes[j]] = [jj, ii];
    }
  }
  return indexes;
}

export function getInitialPositions(): Vector3[] {
  const shuffled = shuffleArray([...RANDOM_POS]);

  return [
    FIXED_POS[0],
    ...shuffled.slice(0, 7),
    FIXED_POS[1],
    ...shuffled.slice(7),
  ].map((pos) => new Vector3(...pos));
}

export const BALLS = [
  {
    id: 0,
    type: "white",
    color: "#faf3eb",
  },
  {
    id: 1,
    type: "solid",
    color: "#ffdd29",
  },
  {
    id: 2,
    type: "solid",
    color: "#252fab",
  },
  {
    id: 3,
    type: "solid",
    color: "#fe0002",
  },
  {
    id: 4,
    type: "solid",
    color: "#670069",
  },
  {
    id: 5,
    type: "solid",
    color: "#fe4e02",
  },
  {
    id: 6,
    type: "solid",
    color: "#01592f",
  },
  {
    id: 7,
    type: "solid",
    color: "#a00018",
  },
  {
    id: 8,
    type: "black",
    color: "#000000",
  },
  {
    id: 9,
    type: "stripe",
    color: "#ffdc28",
  },
  {
    id: 10,
    type: "stripe",
    color: "#252fab",
  },
  {
    id: 11,
    type: "stripe",
    color: "#fe0002",
  },
  {
    id: 12,
    type: "stripe",
    color: "#670069",
  },
  {
    id: 13,
    type: "stripe",
    color: "#fe4e02",
  },
  {
    id: 14,
    type: "stripe",
    color: "#01592f",
  },
  {
    id: 15,
    type: "stripe",
    color: "#a00018",
  },
] as const;
