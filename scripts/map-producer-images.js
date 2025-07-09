#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the producers.json file
const producersPath = path.join(__dirname, '../public/data/producers.json');
const producersData = JSON.parse(fs.readFileSync(producersPath, 'utf8'));

// Map of producer IDs to their image file names (without numbers)
const imageMapping = {
  'avonmore-berry-farm': 'Avonmore Berry Farm',
  'bercier-catering': 'Bercier Catering',
  'bischoff-orchards': 'Bischoff Orchards',
  'brauwerk-hoffman': 'Brauwerk Hoffman',
  'brighter-with-blooms': 'Brighter with Blooms',
  'broken-stick': 'Broken Stick',
  'cafe-joyeux': 'Café Joyeux',
  'cedar-barn-homestead': 'Cedar Barn Homestead',
  'euphie-dici': 'Euphie d_ici',
  'ferme-butte-et-bine': 'Ferme Butte et Bine',
  'fraser-creek-pizza': 'Fraser Creek Pizza Farm',
  'garden-path-soap': 'Garden Path Homemade Soap',
  'gibbs-honey': 'Gibbs Honey',
  'halls-apple-market': 'Halls Apple Market',
  'jamink-farm': 'Jamink Farm',
  'kirkview-farms': 'Kirkview Farms',
  'lorignal-packing': 'L_Orignal Packing',
  'les-fruits-du-poirier': 'Les Fruits du Poirier',
  'les-jardins-ecologistes': 'Les Jardins Écologistes Grégoire',
  'les-vergers-villeneuve': 'Les Vergers Villeneuve and Blueberry Farm',
  'mariposa-farm': 'Mariposa Farm',
  'martines-kitchen': 'Martine_s Kitchen',
  'simply-baked': 'Simply Baked Catering',
  'smirlholm-farms': 'Smirlholm Farms',
  'springfield-farm': 'Springfield Farm',
  'vankleek-hill-vineyard': 'Vankleek Hill Vineyard'
};

// Update each producer with the correct image path
producersData.producers = producersData.producers.map(producer => {
  const baseName = imageMapping[producer.id];
  if (baseName) {
    // Use the first image (1.webp) as the main image
    producer.image = `/images/producers/webp/full/${baseName}1.webp`;
    
    // Add additional images array for gallery
    producer.images = [
      `/images/producers/webp/full/${baseName}1.webp`,
      `/images/producers/webp/full/${baseName}2.webp`,
      `/images/producers/webp/full/${baseName}3.webp`,
      `/images/producers/webp/full/${baseName}4.webp`
    ];
  }
  return producer;
});

// Write the updated producers.json
fs.writeFileSync(producersPath, JSON.stringify(producersData, null, 2));

console.log('✓ Updated producers.json with image paths');
console.log(`✓ Updated ${Object.keys(imageMapping).length} producers`);