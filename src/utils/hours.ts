// Utility functions for checking producer hours

export interface OpenStatus {
  isOpen: boolean;
  opensAt?: string;
  closesAt?: string;
  nextOpen?: string;
}

// Map category emojis
export const CATEGORY_EMOJIS: Record<string, string> = {
  'fruits': '🍓',
  'vegetables': '🥬',
  'dairy': '🧀',
  'meat': '🥩',
  'eggs': '🥚',
  'honey': '🍯',
  'maple': '🍁',
  'beer': '🍺',
  'wine': '🍷',
  'catering': '🍽️',
  'restaurant': '🍴',
  'coffee': '☕',
  'bakery': '🥐',
  'flowers': '🌻',
  'artisan': '🎨',
  'beauty': '💆',
  'accommodation': '🏡',
  'preserves': '🫙',
  'baked-goods': '🍰',
  'pick-your-own': '🧺'
};

export function getProducerEmoji(categories: string[]): string {
  // Return the first matching emoji or a default
  for (const category of categories) {
    if (CATEGORY_EMOJIS[category]) {
      return CATEGORY_EMOJIS[category];
    }
  }
  return '🏪'; // Default store emoji
}

export function checkIfOpen(hours: string): OpenStatus {
  // Handle special cases
  if (!hours || hours.toLowerCase().includes('appointment') || hours.toLowerCase().includes('not open')) {
    return { isOpen: false };
  }

  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes(); // minutes since midnight

  // Simple parser for common formats
  // Examples: "Daily 9am-6pm", "Wed-Sun 10am-5pm", "Monday-Sunday: 9am-9pm"
  
  // Check if it's year-round or seasonal
  if (hours.toLowerCase().includes('year-round')) {
    // Parse the hours part
    const timeMatch = hours.match(/(\d{1,2}):?(\d{2})?\s*(am|pm)/gi);
    if (timeMatch && timeMatch.length >= 2) {
      const openTime = parseTime(timeMatch[0]);
      const closeTime = parseTime(timeMatch[1]);
      
      if (currentTime >= openTime && currentTime < closeTime) {
        return { 
          isOpen: true, 
          closesAt: formatTime(closeTime) 
        };
      } else {
        return { 
          isOpen: false, 
          opensAt: formatTime(openTime) 
        };
      }
    }
  }

  // For now, return a simple check based on common hours
  // This is a simplified implementation
  const typicalOpen = 9 * 60; // 9 AM
  const typicalClose = 17 * 60; // 5 PM
  
  if (currentTime >= typicalOpen && currentTime < typicalClose) {
    return { isOpen: true, closesAt: '5:00 PM' };
  } else {
    return { isOpen: false, opensAt: '9:00 AM' };
  }
}

function parseTime(timeStr: string): number {
  const match = timeStr.match(/(\d{1,2}):?(\d{2})?\s*(am|pm)/i);
  if (!match) return 0;
  
  let hours = parseInt(match[1]);
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const isPM = match[3].toLowerCase() === 'pm';
  
  if (isPM && hours !== 12) hours += 12;
  if (!isPM && hours === 12) hours = 0;
  
  return hours * 60 + minutes;
}

function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
  
  return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
}