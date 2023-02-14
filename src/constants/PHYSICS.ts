// https://billiards.colostate.edu/faq/physics/physical-properties/

export const PHYSIC_CONSTANTS = {
  BALL_FRICTION: 0.05,
  BALL_RESTITUTION: 0.95,

  TABLE_FRICTION: 0.2,
  TABLE_RESTITUTION: 0.55,

  CUE_FRICTION: 0.6,
  CUE_RESTITUTION: 0.65,

  DAMPING: 0.8,
} as const;