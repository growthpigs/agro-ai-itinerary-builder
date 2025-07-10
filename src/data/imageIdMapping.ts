// Map producer IDs from JSON to actual image filenames
// This fixes mismatches between data and image files
export const imageIdMapping: Record<string, string> = {
  // Fix mismatched IDs (base names) - map to numbered version for thumbnails
  'ferme-butte-bine': 'ferme-butte-et-bine-1',
  'fraser-creek-pizza': 'fraser-creek-pizza-farm-1', 
  'garden-path-soap': 'garden-path-homemade-soap-1',
  
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
  
  // Les Jardins needs special handling - the images include "Grégoire" in the name
  'les-jardins-ecologistes': 'les-jardins-ecologistes-gregoire',
  'les-jardins-ecologistes-1': 'les-jardins-ecologistes-gregoire-1',
  'les-jardins-ecologistes-2': 'les-jardins-ecologistes-gregoire-2',
  'les-jardins-ecologistes-3': 'les-jardins-ecologistes-gregoire-3',
  'les-jardins-ecologistes-4': 'les-jardins-ecologistes-gregoire-4',
  
  // Hall's Apple Market - map base to numbered version for thumbnails
  'halls-apple-market': 'halls-apple-market-1',
  'halls-apple-market-1': 'halls-apple-market-1',
  'halls-apple-market-2': 'halls-apple-market-2',
  'halls-apple-market-3': 'halls-apple-market-3',
  'halls-apple-market-4': 'halls-apple-market-4',
  
  // All others use their ID as-is
};