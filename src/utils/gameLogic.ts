
import { Character, DiceResult, ActionResult } from '../types';

export function generateCharacterId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function createNewCharacter(name: string, race: 'Solozo' | 'Barab' | 'Twilighter' | 'Other', background: string): Character {
  const lifeForce = Math.floor(Math.random() * 5) + 5; // 5-10 range
  
  // Different races have different initial skill/characteristic distributions
  let skills: Record<string, number> = {};
  let characteristics: Record<string, number> = {};
  
  if (race === 'Solozo') {
    skills = {
      'technology': Math.floor(Math.random() * 3) + 3,
      'diplomacy': Math.floor(Math.random() * 3) + 2,
      'research': Math.floor(Math.random() * 3) + 3,
      'stealth': Math.floor(Math.random() * 3) + 1
    };
  } else if (race === 'Barab') {
    characteristics = {
      'strength': Math.floor(Math.random() * 3) + 4,
      'endurance': Math.floor(Math.random() * 3) + 3,
      'perception': Math.floor(Math.random() * 3) + 2,
      'agility': Math.floor(Math.random() * 3) + 2
    };
  } else if (race === 'Twilighter') {
    skills = {
      'mysticism': Math.floor(Math.random() * 3) + 4,
      'perception': Math.floor(Math.random() * 3) + 3
    };
    characteristics = {
      'intuition': Math.floor(Math.random() * 3) + 4,
      'willpower': Math.floor(Math.random() * 3) + 3
    };
  } else {
    // Generic distribution for other races
    skills = {
      'survival': Math.floor(Math.random() * 3) + 2,
      'communication': Math.floor(Math.random() * 3) + 2
    };
    characteristics = {
      'strength': Math.floor(Math.random() * 3) + 2,
      'agility': Math.floor(Math.random() * 3) + 2
    };
  }

  return {
    id: generateCharacterId(),
    name,
    race,
    background,
    lifeForce,
    experienceModifier: 0,
    skills,
    characteristics,
    inventory: [],
    sessionHistory: []
  };
}

export function rollDie(min: number = 1, max: number = 10): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateLuckRoll(): DiceResult {
  const min = 1;
  const max = 10;
  
  let positive = rollDie(min, max);
  let negative = rollDie(min, max);
  let exploded = false;
  
  // Handle exploding dice (10s)
  if (positive === max) {
    const extraRoll = generateLuckRoll();
    positive += extraRoll.positive;
    exploded = true;
  }
  
  if (negative === max) {
    const extraRoll = generateLuckRoll();
    negative += extraRoll.negative;
    exploded = true;
  }
  
  return { 
    positive, 
    negative, 
    net: positive - negative,
    exploded 
  };
}

export function getRelevantCharacterValue(character: Character, action: string): number {
  // First check if there's a direct skill match
  if (character.skills[action]) {
    return character.skills[action];
  }
  
  // Check related characteristics
  const actionToCharacteristicMap: Record<string, string[]> = {
    'lifting': ['strength'],
    'running': ['agility', 'endurance'],
    'fighting': ['strength', 'agility'],
    'climbing': ['strength', 'agility'],
    'research': ['intelligence'],
    'persuasion': ['charisma'],
    'perception': ['perception', 'intuition'],
    'stealth': ['agility']
  };
  
  if (actionToCharacteristicMap[action]) {
    let total = 0;
    let count = 0;
    
    for (const characteristic of actionToCharacteristicMap[action]) {
      if (character.characteristics[characteristic]) {
        total += character.characteristics[characteristic];
        count++;
      }
    }
    
    if (count > 0) {
      return Math.floor(total / count);
    }
  }
  
  // Default to life force if nothing else fits
  return Math.floor(character.lifeForce / 2);
}

export function resolveAction(
  character: Character, 
  action: string, 
  difficulty: number
): ActionResult {
  // Variables for calculation
  const baseValue = getRelevantCharacterValue(character, action);
  const experienceModifier = character.experienceModifier;
  const challengeValue = -1 * difficulty;
  const diceResult = generateLuckRoll();
  
  // Final calculation
  const resultValue = baseValue + experienceModifier + challengeValue + diceResult.net;
  
  // Determine outcome based on result value
  const success = resultValue > 0;
  const degree = Math.abs(resultValue);
  
  let description = success 
    ? degree > 5 
      ? "Extraordinary success!" 
      : degree > 2 
        ? "Clear success!" 
        : "Narrow success!"
    : degree > 5 
      ? "Catastrophic failure!" 
      : degree > 2 
        ? "Significant failure!" 
        : "Narrow failure!";
  
  if (diceResult.exploded) {
    description += " (Exploding dice!)";
  }
  
  return {
    success,
    degree,
    description,
    diceResult,
  };
}

export function formatDiceRoll(result: DiceResult): string {
  return `🎲 [+${result.positive}] vs [-${result.negative}] = Net: ${result.net > 0 ? '+' + result.net : result.net}${result.exploded ? ' (Exploded!)' : ''}`;
}

export function saveSession(session: any): void {
  try {
    localStorage.setItem(`urb_session_${session.id}`, JSON.stringify(session));
  } catch (error) {
    console.error("Failed to save session:", error);
  }
}

export function loadSession(sessionId: string): any {
  try {
    const saved = localStorage.getItem(`urb_session_${sessionId}`);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error("Failed to load session:", error);
    return null;
  }
}

export function getStoredSessions(): string[] {
  const sessions = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('urb_session_')) {
      sessions.push(key.replace('urb_session_', ''));
    }
  }
  return sessions;
}
