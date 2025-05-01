
export type Race = 'Solozo' | 'Barab' | 'Twilighter' | 'Other';

export interface Character {
  id: string;
  name: string;
  race: Race;
  background: string;
  lifeForce: number;
  experienceModifier: number;
  skills: Record<string, number>;
  characteristics: Record<string, number>;
  inventory: string[];
  sessionHistory: string[];
}

export interface Message {
  id: string;
  content: string;
  sender: 'dm' | 'player' | 'system';
  timestamp: number;
}

export interface Session {
  id: string;
  name: string;
  character?: Character;
  messages: Message[];
  currentLocation: string;
  activeNPCs: string[];
  narrativeState: string;
  timeline: string[];
}

export interface DiceResult {
  positive: number;
  negative: number;
  net: number;
  exploded: boolean;
}

export interface ActionResult {
  success: boolean;
  degree: number;
  description: string;
  diceResult: DiceResult;
}
