const FIXED_POS = [
  [0, 0.05, 0.55], // 0
  [0, 0.05, -0.64], // 8
];

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
];

export function shuffleArray<T>(indexes: T[]): T[] {
  for (let i = indexes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
  }
  return indexes;
}

export default function getInitialPositions() {
  const shuffled = shuffleArray(RANDOM_POS);

  return [
    FIXED_POS[0],
    ...shuffled.slice(0, 7),
    FIXED_POS[1],
    ...shuffled.slice(7),
  ] as [number, number, number][];
}
