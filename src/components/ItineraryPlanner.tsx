import React, { useState } from 'react';
import { X, Globe, Sparkles, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

interface Place {
  id: string;
  name: string;
  description?: string;
  location: {
    lat: number;
    lon: number;
  };
  distance?: number;
  category?: string;
  image?: string;
}

interface ItineraryPlannerProps {
  onClose: () => void;
  places: Place[];
  userLocation: [number, number] | null;
  onGenerateAI?: (destination: string, days: number, preferences: string) => void;
  isLoading?: boolean;
}

export function ItineraryPlanner({ 
  onClose, 
  places, 
  userLocation, 
  onGenerateAI,
  isLoading = false
}: ItineraryPlannerProps) {
  const [destination, setDestination] = useState('');
  const [numDays, setNumDays] = useState(1);
  const [preferences, setPreferences] = useState('');

  const handleGenerateAIItinerary = () => {
    if (onGenerateAI && destination && numDays > 0) {
      onGenerateAI(destination, numDays, preferences);
    }
  };

  return (
    <div className="absolute top-20 right-8 z-[1000] w-96 max-h-[calc(100vh-160px)] bg-black/30 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">AI Itinerary Planner</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition-all duration-300"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(100vh-280px)] pr-2">
          <motion.div
            key="ai-planner"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white/5 rounded-xl p-4 mb-4">
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <h3 className="text-white font-medium">AI Itinerary Generator</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-white/70 text-sm block mb-2">Destination</label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g., San Francisco, Paris, Tokyo"
                    className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
                
                <div>
                  <label className="text-white/70 text-sm block mb-2">Number of Days</label>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    value={numDays}
                    onChange={(e) => setNumDays(parseInt(e.target.value))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
                
                <div>
                  <label className="text-white/70 text-sm block mb-2">Preferences</label>
                  <textarea
                    value={preferences}
                    onChange={(e) => setPreferences(e.target.value)}
                    placeholder="e.g., family-friendly, outdoor activities, historical sites, foodie experiences, budget-conscious"
                    rows={4}
                    className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                  />
                </div>
              </div>
            </div>
            
            <button
              onClick={handleGenerateAIItinerary}
              disabled={isLoading || !destination || numDays < 1}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-medium transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Generating Itinerary...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate AI Itinerary</span>
                </>
              )}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}