
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Character, Race } from '@/types';
import { createNewCharacter } from '@/utils/gameLogic';

interface CharacterSheetProps {
  character?: Character;
  onSave: (character: Character) => void;
}

const CharacterSheet: React.FC<CharacterSheetProps> = ({ character, onSave }) => {
  const [editMode, setEditMode] = useState(!character);
  const [name, setName] = useState(character?.name || '');
  const [race, setRace] = useState<Race>(character?.race || 'Solozo');
  const [background, setBackground] = useState(character?.background || '');
  
  const handleSave = () => {
    if (editMode) {
      const newCharacter = character 
        ? { ...character, name, race, background }
        : createNewCharacter(name, race, background);
      
      onSave(newCharacter);
      setEditMode(false);
    } else {
      setEditMode(true);
    }
  };
  
  const renderStatValue = (value: number) => {
    const dots = [];
    for (let i = 0; i < 10; i++) {
      dots.push(
        <span 
          key={i} 
          className={`inline-block w-2 h-2 rounded-full mx-0.5 ${i < value ? 'bg-primary' : 'bg-muted'}`}
        />
      );
    }
    return (
      <div className="flex items-center">
        <span className="text-lg mr-2">{value}</span>
        <div className="flex">{dots}</div>
      </div>
    );
  };

  return (
    <Card className="w-full bg-card border-urb-purple">
      <CardHeader className="bg-urb-purple/10">
        <CardTitle className="flex justify-between items-center">
          <span className="font-fantasy">
            {editMode ? 'Create Character' : character?.name || 'Character Sheet'}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSave}
            disabled={editMode && (!name || !background)}
          >
            {editMode ? 'Save' : 'Edit'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {editMode ? (
          <>
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-semibold">Name</label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter character name"
                className="bg-muted/30"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="race" className="text-sm font-semibold">Race</label>
              <Select value={race} onValueChange={(value: Race) => setRace(value)}>
                <SelectTrigger className="bg-muted/30">
                  <SelectValue placeholder="Select a race" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Solozo">Solozo</SelectItem>
                  <SelectItem value="Barab">Barab</SelectItem>
                  <SelectItem value="Twilighter">Twilighter</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="background" className="text-sm font-semibold">Background</label>
              <Textarea
                id="background"
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                placeholder="Describe your character's background"
                className="bg-muted/30 min-h-24"
              />
            </div>
          </>
        ) : character ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm text-muted-foreground">Race</h4>
                <p className="font-semibold">{character.race}</p>
              </div>
              <div>
                <h4 className="text-sm text-muted-foreground">Life Force</h4>
                {renderStatValue(character.lifeForce)}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm text-muted-foreground mb-1">Background</h4>
              <p className="text-sm">{character.background}</p>
            </div>
            
            {Object.keys(character.skills).length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Skills</h4>
                <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                  {Object.entries(character.skills).map(([skill, value]) => (
                    <div key={skill} className="flex justify-between items-center">
                      <span className="capitalize">{skill}</span>
                      {renderStatValue(value)}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {Object.keys(character.characteristics).length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Characteristics</h4>
                <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                  {Object.entries(character.characteristics).map(([characteristic, value]) => (
                    <div key={characteristic} className="flex justify-between items-center">
                      <span className="capitalize">{characteristic}</span>
                      {renderStatValue(value)}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {character.inventory.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Inventory</h4>
                <ul className="list-disc list-inside">
                  {character.inventory.map((item, index) => (
                    <li key={index} className="text-sm">{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            No character information available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CharacterSheet;
