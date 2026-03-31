export interface HumanStats {
  abstraction: number;
  anger: number;
  fear: number;
}

export interface Character {
  id: string;
  name: string;
  type: 'human' | 'caine' | 'bubble';
  position: [number, number, number];
  stats?: HumanStats;
  dialogue?: string;
  targetPosition?: [number, number, number];
  isAbstracted?: boolean;
}

export interface WorldObject {
  id: string;
  type: 'box' | 'sphere' | 'cylinder';
  position: [number, number, number];
  scale: [number, number, number];
  color: string;
}

export interface Adventure {
  id: string;
  name: string;
  description: string;
  objects: WorldObject[];
}
