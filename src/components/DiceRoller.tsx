
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { generateLuckRoll, formatDiceRoll } from '@/utils/gameLogic';
import { DiceResult } from '@/types';

interface DiceRollerProps {
  onRollComplete: (result: DiceResult) => void;
}

const DiceRoller: React.FC<DiceRollerProps> = ({ onRollComplete }) => {
  const [rolling, setRolling] = useState(false);
  const [lastResult, setLastResult] = useState<DiceResult | null>(null);

  const handleRoll = () => {
    setRolling(true);
    
    // Add a delay to create anticipation
    setTimeout(() => {
      const result = generateLuckRoll();
      setLastResult(result);
      onRollComplete(result);
      setRolling(false);
    }, 800);
  };

  return (
    <div className="flex flex-col items-center gap-3 p-3 border border-border rounded-lg bg-muted/20">
      <h3 className="text-lg font-fantasy text-accent">Fate's Dice</h3>
      
      <div className="flex items-center gap-3">
        <Button 
          onClick={handleRoll} 
          disabled={rolling}
          variant="outline"
          className={`w-20 h-20 text-xl flex items-center justify-center ${rolling ? 'animate-dice-roll' : ''}`}
        >
          🎲
        </Button>
      </div>
      
      {lastResult && (
        <div className="text-sm text-center text-muted-foreground mt-2">
          {formatDiceRoll(lastResult)}
        </div>
      )}
    </div>
  );
};

export default DiceRoller;
