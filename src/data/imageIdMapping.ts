// Map producer IDs from JSON to actual image filenames
// This fixes mismatches between data and image files
export const imageIdMapping: Record<string, string> = {
  // Fix mismatched IDs (base names)
  'ferme-butte-bine': 'ferme-butte-et-bine',
  'fraser-creek-pizza': 'fraser-creek-pizza-farm', 
  'garden-path-soap': 'garden-path-homemade-soap',
  
  // Also map numbered variants
  'ferme-butte-bine-1': 'ferme-butte-et-bine-1',
  'ferme-butte-bine-2': 'ferme-butte-et-bine-2',
  'ferme-butte-bine-3': 'ferme-butte-et-bine-3',
  'ferme-butte-bine-4': 'ferme-butte-et-bine-4',
  
  'fraser-creek-pizza-1': 'fraser-creek-pizza-farm-1',
  'fraser-creek-pizza-2': 'fraser-creek-pizza-farm-2',
  'fraser-creek-pizza-3': 'fraser-creek-pizza-farm-3',
  'fraser-creek-pizza-4': 'fraser-creek-pizza-farm-4',
  
  'garden-path-soap-1': 'garden-path-homemade-soap-1',
  'garden-path-soap-2': 'garden-path-homemade-soap-2',
  'garden-path-soap-3': 'garden-path-homemade-soap-3',
  'garden-path-soap-4': 'garden-path-homemade-soap-4',
  
  // Missing images - use placeholders
  'cafe-joyeux': 'placeholder',
  'cafe-joyeux-1': 'placeholder',
  'cafe-joyeux-2': 'placeholder',
  'cafe-joyeux-3': 'placeholder',
  'cafe-joyeux-4': 'placeholder',
  
  'les-jardins-ecologistes': 'placeholder',
  'les-jardins-ecologistes-1': 'placeholder',
  'les-jardins-ecologistes-2': 'placeholder',
  'les-jardins-ecologistes-3': 'placeholder',
  'les-jardins-ecologistes-4': 'placeholder',
  
  // All others use their ID as-is
};