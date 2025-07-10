#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Directories to process
const directories = [
  'public/images/producers/jpg/full',
  'public/images/producers/jpg/medium', 
  'public/images/producers/jpg/thumb',
  'public/images/producers/webp/full',
  'public/images/producers/webp/medium',
  'public/images/producers/webp/thumb'
];

// Map of producer names to their slug format
const producerMapping = {
  'Avonmore Berry Farm': 'avonmore-berry-farm',
  'Bercier Catering': 'bercier-catering',
  'Bischoff Orchards': 'bischoff-orchards',
  'Brauwerk Hoffman': 'brauwerk-hoffman',
  'Brighter with Blooms': 'brighter-with-blooms',
  'Broken Stick': 'broken-stick',
  'Café Joyeux': 'cafe-joyeux',
  'Cedar Barn Homestead': 'cedar-barn-homestead',
  'Euphie d_ici': 'euphie-dici',
  'Ferme Butte et Bine': 'ferme-butte-et-bine',
  'Fraser Creek Pizza Farm': 'fraser-creek-pizza-farm',
  'Garden Path Homemade Soap': 'garden-path-homemade-soap',
  'Gibbs Honey': 'gibbs-honey',
  'Halls Apple Market': 'halls-apple-market',
  'Jamink Farm': 'jamink-farm',
  'Kirkview Farms': 'kirkview-farms',
  'L_Orignal Packing': 'lorignal-packing',
  'Les Fruits du Poirier': 'les-fruits-du-poirier',
  'Les Jardins Écologistes Grégoire': 'les-jardins-ecologistes-gregoire',
  'Les Vergers Villeneuve and Blueberry Farm': 'les-vergers-villeneuve',
  'Mariposa Farm': 'mariposa-farm',
  'Martine_s Kitchen': 'martines-kitchen',
  'Simply Baked Catering': 'simply-baked-catering',
  'Smirlholm Farms': 'smirlholm-farms',
  'Springfield Farm': 'springfield-farm',
  'Vankleek Hill Vineyard': 'vankleek-hill-vineyard'
};

function normalizeImageNames() {
  directories.forEach(dir => {
    const fullPath = path.join(process.cwd(), dir);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`Directory not found: ${fullPath}`);
      return;
    }

    const files = fs.readdirSync(fullPath);
    
    files.forEach(file => {
      // Skip non-image files
      if (!file.match(/\.(jpg|jpeg|webp)$/i)) return;
      
      // Try to match producer name
      let renamed = false;
      
      for (const [producerName, slug] of Object.entries(producerMapping)) {
        // Check if file starts with producer name
        if (file.startsWith(producerName)) {
          // Extract the number (if any)
          const numberMatch = file.match(/(\d+)\.(jpg|jpeg|webp)$/i);
          if (numberMatch) {
            const number = numberMatch[1];
            const extension = numberMatch[2];
            const newName = `${slug}-${number}.${extension}`;
            const oldPath = path.join(fullPath, file);
            const newPath = path.join(fullPath, newName);
            
            if (oldPath !== newPath) {
              fs.renameSync(oldPath, newPath);
              console.log(`Renamed: ${file} -> ${newName}`);
              renamed = true;
              break;
            }
          }
        }
      }
      
      if (!renamed && file !== '.DS_Store') {
        console.log(`No mapping for: ${file}`);
      }
    });
  });
}

// Run the normalization
console.log('Normalizing image names...');
normalizeImageNames();
console.log('Done!');