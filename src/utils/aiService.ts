import axios from 'axios';

const GEMINI_API_KEY = 'AIzaSyA6ZIMuDJID7tCrsw36gPRmHl5RSZOW-No';

/**
 * Generate an AI-powered travel itinerary using Google's Gemini API
 * @param destination The destination for the itinerary
 * @param days Number of days for the trip
 * @param preferences User preferences (e.g., "family-friendly", "outdoor activities")
 * @returns The generated itinerary text
 */
export async function generateAIItinerary(destination: string, days: number, preferences: string): Promise<string> {
  try {
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
      {
        contents: [{
          parts: [{
            text: `Create a detailed travel itinerary for ${destination} for ${days} days. 
                  Consider preferences: ${preferences}. 
                  Include places to visit, activities, and food recommendations.
                  Format the response with clear day headers, times, and activities.`
          }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': GEMINI_API_KEY
        }
      }
    );

    if (response.data && response.data.candidates && response.data.candidates.length > 0) {
      return response.data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('No valid response from Gemini API');
    }
  } catch (error) {
    console.error('Error generating AI itinerary:', error);
    throw error;
  }
}

/**
 * Generate AI recommendations for places to visit based on user preferences
 * @param location Current location coordinates [lat, lon]
 * @param preferences User preferences
 * @returns List of recommended places with descriptions
 */
export async function generatePlaceRecommendations(
  location: [number, number], 
  preferences: string
): Promise<any[]> {
  try {
    const [lat, lon] = location;
    
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
      {
        contents: [{
          parts: [{
            text: `Based on the location coordinates (${lat}, ${lon}), suggest 5 interesting places to visit nearby. 
                  Consider preferences: ${preferences}.
                  Return the response as a JSON array with each place having: name, description, category, and estimated distance.`
          }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': GEMINI_API_KEY
        }
      }
    );

    if (response.data && response.data.candidates && response.data.candidates.length > 0) {
      const text = response.data.candidates[0].content.parts[0].text;
      
      // Extract JSON from the response text
      const jsonMatch = text.match(/\[\s*\{.*\}\s*\]/s);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch (e) {
          console.error('Error parsing JSON from AI response:', e);
          return [];
        }
      }
    }
    
    return [];
  } catch (error) {
    console.error('Error generating place recommendations:', error);
    return [];
  }
}