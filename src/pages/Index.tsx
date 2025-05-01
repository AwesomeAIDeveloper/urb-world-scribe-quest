
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import ChatInterface from '@/components/ChatInterface';
import CharacterSheet from '@/components/CharacterSheet';
import LoreViewer from '@/components/LoreViewer';
import { Character, Message, Session } from '@/types';
import { saveSession, loadSession, getStoredSessions } from '@/utils/gameLogic';

const Index = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('chat');
  const [character, setCharacter] = useState<Character | undefined>();
  const [sessionName, setSessionName] = useState('New Adventure');
  const [sessionId, setSessionId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [savedSessions, setSavedSessions] = useState<string[]>([]);
  const [showNewSessionDialog, setShowNewSessionDialog] = useState(true);
  const [showLoadSessionDialog, setShowLoadSessionDialog] = useState(false);
  
  // Generate a new session ID
  const generateSessionId = () => {
    return Date.now().toString();
  };
  
  // Create a new session
  const createNewSession = (name: string) => {
    const newSessionId = generateSessionId();
    
    const newSession: Session = {
      id: newSessionId,
      name: name,
      messages: [],
      currentLocation: 'Unknown',
      activeNPCs: [],
      narrativeState: 'Beginning of adventure',
      timeline: []
    };
    
    saveSession(newSession);
    setSessionId(newSessionId);
    setSessionName(name);
    setCharacter(undefined);
    setMessages([]);
    
    toast({
      title: "New Adventure",
      description: `${name} has been created.`,
    });
    
    setShowNewSessionDialog(false);
    loadSavedSessions();
  };
  
  // Load an existing session
  const loadExistingSession = (id: string) => {
    const session = loadSession(id);
    
    if (session) {
      setSessionId(session.id);
      setSessionName(session.name);
      setCharacter(session.character);
      setMessages(session.messages || []);
      
      toast({
        title: "Adventure Continued",
        description: `${session.name} has been loaded.`,
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to load session.",
        variant: "destructive",
      });
    }
    
    setShowLoadSessionDialog(false);
  };
  
  // Save the current session
  const saveCurrentSession = () => {
    if (!sessionId) return;
    
    const session: Session = {
      id: sessionId,
      name: sessionName,
      character: character,
      messages: messages,
      currentLocation: 'Current location',
      activeNPCs: [],
      narrativeState: 'Current state',
      timeline: []
    };
    
    saveSession(session);
    
    toast({
      title: "Progress Saved",
      description: "Your adventure has been saved.",
    });
    
    loadSavedSessions();
  };
  
  // Load the list of saved sessions
  const loadSavedSessions = () => {
    const sessions = getStoredSessions();
    setSavedSessions(sessions);
  };
  
  // Handle character updates
  const handleCharacterUpdate = (updatedCharacter: Character) => {
    setCharacter(updatedCharacter);
    
    // If this is the first time creating a character, add a welcome message
    if (!character) {
      const newMessage: Message = {
        id: Date.now().toString(),
        content: `Welcome, ${updatedCharacter.name} of the ${updatedCharacter.race}! Your adventure in the URB world begins now.`,
        sender: 'dm',
        timestamp: Date.now()
      };
      
      setMessages([...messages, newMessage]);
    }
    
    // Update the session with the new character
    if (sessionId) {
      const session = loadSession(sessionId);
      if (session) {
        session.character = updatedCharacter;
        saveSession(session);
      }
    }
  };
  
  // Handle message updates
  const handleMessageUpdate = (updatedMessages: Message[]) => {
    setMessages(updatedMessages);
    
    // Update the session with the new messages
    if (sessionId) {
      const session = loadSession(sessionId);
      if (session) {
        session.messages = updatedMessages;
        saveSession(session);
      }
    }
  };
  
  // Load saved sessions on component mount
  useEffect(() => {
    loadSavedSessions();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-gradient-to-r from-urb-dark to-urb-deep-purple shadow-lg">
        <div className="container mx-auto py-4 px-4 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center mb-4 sm:mb-0">
            <h1 className="text-3xl font-fantasy text-urb-accent">URB World</h1>
            <span className="ml-3 text-lg opacity-75">Scribe Quest</span>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="border-urb-accent text-urb-accent hover:text-urb-dark hover:bg-urb-accent"
              onClick={() => setShowNewSessionDialog(true)}
            >
              New Adventure
            </Button>
            
            {savedSessions.length > 0 && (
              <Button 
                variant="ghost" 
                className="text-urb-accent hover:text-urb-accent hover:bg-urb-dark"
                onClick={() => setShowLoadSessionDialog(true)}
              >
                Load Adventure
              </Button>
            )}
            
            {sessionId && (
              <Button 
                variant="ghost"
                className="text-urb-accent hover:text-urb-accent hover:bg-urb-dark"
                onClick={saveCurrentSession}
              >
                Save Progress
              </Button>
            )}
          </div>
        </div>
      </header>
      
      <main className="container mx-auto p-4">
        {sessionId ? (
          <div className="mb-4">
            <h2 className="text-xl font-fantasy text-urb-purple">{sessionName}</h2>
            <p className="text-sm text-muted-foreground">
              Adventure in progress{character ? ` - Playing as ${character.name}` : ''}
            </p>
          </div>
        ) : (
          <div className="mb-4 p-4 border border-border rounded-lg bg-muted/10 text-center">
            <h2 className="text-xl font-fantasy text-urb-purple">Welcome to URB World Scribe Quest</h2>
            <p className="text-muted-foreground mt-2">Start a new adventure or load an existing one to begin</p>
          </div>
        )}
        
        {sessionId && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="md:col-span-2">
              <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="chat">Chat</TabsTrigger>
                  <TabsTrigger value="lore">World Knowledge</TabsTrigger>
                </TabsList>
                
                <TabsContent value="chat" className="h-[700px]">
                  <ChatInterface 
                    character={character} 
                    sessionId={sessionId}
                    initialMessages={messages}
                    onSaveMessages={handleMessageUpdate}
                  />
                </TabsContent>
                
                <TabsContent value="lore">
                  <LoreViewer />
                </TabsContent>
              </Tabs>
            </div>
            
            <div>
              <CharacterSheet 
                character={character}
                onSave={handleCharacterUpdate}
              />
            </div>
          </div>
        )}
      </main>
      
      {/* New Session Dialog */}
      <Dialog open={showNewSessionDialog} onOpenChange={setShowNewSessionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Begin a New Adventure</DialogTitle>
            <DialogDescription>
              Enter a name for your new URB World adventure.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="sessionName">Adventure Name</Label>
              <Input
                id="sessionName"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                placeholder="Enter adventure name"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewSessionDialog(false)}>Cancel</Button>
            <Button onClick={() => createNewSession(sessionName)}>Begin Adventure</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Load Session Dialog */}
      <Dialog open={showLoadSessionDialog} onOpenChange={setShowLoadSessionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Load Adventure</DialogTitle>
            <DialogDescription>
              Select an adventure to continue.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4 max-h-60 overflow-y-auto">
            {savedSessions.length > 0 ? (
              savedSessions.map((id) => {
                const session = loadSession(id);
                return (
                  <Button 
                    key={id}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3"
                    onClick={() => loadExistingSession(id)}
                  >
                    <div>
                      <div className="font-semibold">{session?.name || "Unnamed Adventure"}</div>
                      <div className="text-xs text-muted-foreground">
                        {session?.character ? `Playing as ${session.character.name}` : "No character"}
                      </div>
                    </div>
                  </Button>
                );
              })
            ) : (
              <p className="text-muted-foreground text-center">No saved adventures found.</p>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLoadSessionDialog(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
