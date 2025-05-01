
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import urbKnowledge from '../utils/urbKnowledge';

const LoreViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState('races');
  
  return (
    <Card className="w-full bg-card border-urb-purple">
      <CardHeader className="bg-urb-purple/10">
        <CardTitle className="font-fantasy">URB World Knowledge</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <Tabs defaultValue="races" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="races">Races</TabsTrigger>
            <TabsTrigger value="locations">Locations</TabsTrigger>
            <TabsTrigger value="concepts">Concepts</TabsTrigger>
            <TabsTrigger value="stories">Stories</TabsTrigger>
          </TabsList>
          
          <TabsContent value="races" className="h-[400px] overflow-y-auto urb-scroll">
            <div className="space-y-4">
              {urbKnowledge.races.map((race) => (
                <div key={race.name} className="parchment">
                  <h3 className="text-xl font-semibold mb-2">{race.name}</h3>
                  <p>{race.description}</p>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="locations" className="h-[400px] overflow-y-auto urb-scroll">
            <div className="space-y-4">
              {urbKnowledge.locations.map((location) => (
                <div key={location.name} className="parchment">
                  <h3 className="text-xl font-semibold mb-2">{location.name}</h3>
                  <p>{location.description}</p>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="concepts" className="h-[400px] overflow-y-auto urb-scroll">
            <div className="space-y-4">
              {urbKnowledge.concepts.map((concept) => (
                <div key={concept.name} className="parchment">
                  <h3 className="text-xl font-semibold mb-2">{concept.name}</h3>
                  <p>{concept.description}</p>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="stories" className="h-[400px] overflow-y-auto urb-scroll">
            <div className="space-y-4">
              {urbKnowledge.coreNarratives.map((narrative) => (
                <div key={narrative.title} className="parchment">
                  <h3 className="text-xl font-semibold mb-2">{narrative.title}</h3>
                  <p>{narrative.content}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LoreViewer;
