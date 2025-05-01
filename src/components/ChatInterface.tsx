
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Message, Character, DiceResult } from '@/types';
import { resolveAction, formatDiceRoll, generateLuckRoll } from '@/utils/gameLogic';
import { generateDMResponse } from '@/utils/urbKnowledge';
import DiceRoller from './DiceRoller';

interface ChatInterfaceProps {
  character?: Character;
  sessionId: string;
  onSaveMessages: (messages: Message[]) => void;
  initialMessages?: Message[];
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  character, 
  sessionId, 
  onSaveMessages,
  initialMessages = []
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [rollMode, setRollMode] = useState(false);
  const [actionContext, setActionContext] = useState('');
  const [difficulty, setDifficulty] = useState(5);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const addMessage = (content: string, sender: 'dm' | 'player' | 'system') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: Date.now()
    };
    
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    onSaveMessages(updatedMessages);
  };
  
  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add player message
    addMessage(input, 'player');
    
    // Generate DM response (in a real app, this would call an API)
    setTimeout(() => {
      if (character) {
        const dmResponse = generateDMResponse(input, character, sessionId);
        addMessage(dmResponse, 'dm');
      } else {
        addMessage("Please create a character before continuing your adventure.", 'system');
      }
    }, 500);
    
    setInput('');
  };
  
  const handleRollAction = (action: string, difficultyValue: number) => {
    if (!character) {
      addMessage("You need a character to perform actions.", 'system');
      return;
    }
    
    setActionContext(action);
    setDifficulty(difficultyValue);
    setRollMode(true);
  };
  
  const handleRollComplete = (result: DiceResult) => {
    if (!character) return;
    
    const actionResult = resolveAction(character, actionContext, difficulty);
    
    // Add system message about the roll
    addMessage(
      `${character.name} attempts to ${actionContext} (Difficulty: ${difficulty})...\n${formatDiceRoll(actionResult.diceResult)}`, 
      'system'
    );
    
    // Add DM message with the result
    setTimeout(() => {
      const resultMessage = `${actionResult.description} Your attempt to ${actionContext} ${actionResult.success ? 'succeeds' : 'fails'}${actionResult.degree > 3 ? ' dramatically' : ''}.`;
      addMessage(resultMessage, 'dm');
      
      setRollMode(false);
      setActionContext('');
    }, 1000);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      if (character) {
        addMessage(`Welcome to the world of URB, ${character.name}. Your journey awaits in this realm of ancient mysteries and uncertain alliances. What path will you choose?`, 'dm');
      } else {
        addMessage("Welcome to the URB World! Create a character to begin your adventure.", 'dm');
      }
    }
  }, []);

  return (
    <Card className="flex flex-col h-full bg-card border-accent">
      <CardHeader className="bg-urb-purple/10 pb-2">
        <CardTitle className="font-fantasy">
          {character ? `${character.name}'s Journey` : 'URB World'}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-grow overflow-y-auto urb-scroll p-4">
        <div className="space-y-2">
          {messages.map((message) => (
            <div key={message.id} className={
              message.sender === 'dm' ? 'dm-message' : 
              message.sender === 'player' ? 'player-message' : 
              'system-message'
            }>
              {message.content.split('\n').map((line, i) => (
                <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>
              ))}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      
      <CardFooter className="border-t border-border p-4">
        {rollMode ? (
          <div className="w-full space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-fantasy">Roll for: {actionContext}</h3>
              <p className="text-sm text-muted-foreground">Difficulty: {difficulty}</p>
            </div>
            <DiceRoller onRollComplete={handleRollComplete} />
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setRollMode(false)}
            >
              Cancel Roll
            </Button>
          </div>
        ) : (
          <div className="w-full space-y-3">
            <Textarea 
              placeholder="What do you want to do?"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-24 bg-muted/30"
              disabled={!character}
            />
            
            <div className="flex justify-between">
              <div className="flex space-x-2">
                {character && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRollAction('explore', 4)}
                    >
                      Explore
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRollAction('investigate', 5)}
                    >
                      Investigate
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRollAction('persuade', 6)}
                    >
                      Persuade
                    </Button>
                  </>
                )}
              </div>
              
              <Button 
                onClick={handleSendMessage} 
                disabled={!input.trim() || !character}
              >
                Send
              </Button>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ChatInterface;
