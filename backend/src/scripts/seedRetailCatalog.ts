import { connectDatabase } from '../config/database';
import { RetailProduct } from '../models/RetailProduct';

const CATALOG = [
  // Home Depot
  { retailer: 'home_depot' as const, sku: 'HD-206PT-8', name: '2 in. x 6 in. x 8 ft. Ground Contact Pressure-Treated Lumber', category: 'lumber', keywords: ['2x6', 'deck', 'pressure', 'treated', 'lumber', 'board'], price: 8.97, unit: 'each', url: 'https://www.homedepot.com/p/2x6-8ft-PT', inStock: true },
  { retailer: 'home_depot' as const, sku: 'HD-208PT-12', name: '2 in. x 8 in. x 12 ft. Ground Contact Pressure-Treated Lumber', category: 'lumber', keywords: ['2x8', 'joist', 'pressure', 'treated'], price: 14.47, unit: 'each', url: 'https://www.homedepot.com/p/2x8-12ft-PT', inStock: true },
  { retailer: 'home_depot' as const, sku: 'HD-404PT-8', name: '4 in. x 4 in. x 8 ft. Ground Contact Pressure-Treated Wood Post', category: 'lumber', keywords: ['4x4', 'post', 'pressure', 'treated'], price: 12.98, unit: 'each', url: 'https://www.homedepot.com/p/4x4-8ft-PT', inStock: true },
  { retailer: 'home_depot' as const, sku: 'HD-204PT-8', name: '2 in. x 4 in. x 8 ft. Ground Contact Pressure-Treated Lumber', category: 'lumber', keywords: ['2x4', 'pressure', 'treated', 'lumber'], price: 5.97, unit: 'each', url: 'https://www.homedepot.com/p/2x4-8ft-PT', inStock: true },
  { retailer: 'home_depot' as const, sku: 'HD-CONC-80', name: 'Quikrete 80 lb. Concrete Mix', category: 'concrete', keywords: ['concrete', 'mix', 'bag', 'quikrete'], price: 5.98, unit: 'bag', url: 'https://www.homedepot.com/p/quikrete-80', inStock: true },
  { retailer: 'home_depot' as const, sku: 'HD-SCREW-310', name: 'Grip-Rite #10 x 3 in. External Hex Flange Hex-Head Lag Screws (50-Pack)', category: 'fasteners', keywords: ['screw', 'deck', 'galvanized', 'lag'], price: 12.47, unit: 'pack', url: 'https://www.homedepot.com/p/deck-screws', inStock: true },
  { retailer: 'home_depot' as const, sku: 'HD-SCREW-DCK', name: 'Deck Mate #10 x 3 in. Star Flat-Head Deck Screws (5 lb.)', category: 'fasteners', keywords: ['screw', 'deck', 'galvanized'], price: 24.98, unit: 'box', url: 'https://www.homedepot.com/p/deckmate-screws', inStock: true },
  { retailer: 'home_depot' as const, sku: 'HD-JH-206', name: 'Simpson Strong-Tie LUS26Z Z-Max Joist Hanger for 2x6', category: 'hardware', keywords: ['joist', 'hanger', 'simpson'], price: 2.47, unit: 'each', url: 'https://www.homedepot.com/p/joist-hanger', inStock: true },
  { retailer: 'home_depot' as const, sku: 'HD-PA-4444', name: 'OZCO 4x4 Post Anchor Base', category: 'hardware', keywords: ['post', 'anchor', 'base'], price: 18.97, unit: 'each', url: 'https://www.homedepot.com/p/post-anchor', inStock: true },
  { retailer: 'home_depot' as const, sku: 'HD-STAIN-DECK', name: 'BEHR Premium Transparent Waterproofing Stain, 1 gal.', category: 'finishing', keywords: ['stain', 'sealer', 'deck', 'behr'], price: 39.98, unit: 'gallon', url: 'https://www.homedepot.com/p/behr-stain', inStock: true },
  // Lowe's
  { retailer: 'lowes' as const, sku: 'LW-206PT-8', name: 'Severe Weather 2-in x 6-in x 8-ft #2 Ground Contact Pressure Treated Lumber', category: 'lumber', keywords: ['2x6', 'deck', 'pressure', 'treated'], price: 8.48, unit: 'each', url: 'https://www.lowes.com/p/2x6-8ft-PT', inStock: true },
  { retailer: 'lowes' as const, sku: 'LW-208PT-12', name: 'Severe Weather 2-in x 8-in x 12-ft #2 Ground Contact Pressure Treated Lumber', category: 'lumber', keywords: ['2x8', 'joist', 'pressure', 'treated'], price: 13.98, unit: 'each', url: 'https://www.lowes.com/p/2x8-12ft-PT', inStock: true },
  { retailer: 'lowes' as const, sku: 'LW-404PT-8', name: 'Severe Weather 4-in x 4-in x 8-ft #2 Ground Contact Pressure Treated Wood', category: 'lumber', keywords: ['4x4', 'post', 'pressure', 'treated'], price: 12.48, unit: 'each', url: 'https://www.lowes.com/p/4x4-8ft-PT', inStock: true },
  { retailer: 'lowes' as const, sku: 'LW-204PT-8', name: 'Severe Weather 2-in x 4-in x 8-ft #2 Ground Contact Pressure Treated Lumber', category: 'lumber', keywords: ['2x4', 'pressure', 'treated'], price: 5.48, unit: 'each', url: 'https://www.lowes.com/p/2x4-8ft-PT', inStock: true },
  { retailer: 'lowes' as const, sku: 'LW-CONC-80', name: 'Sakrete 80-lb High Strength Concrete Mix', category: 'concrete', keywords: ['concrete', 'mix', 'sakrete'], price: 5.48, unit: 'bag', url: 'https://www.lowes.com/p/sakrete-80', inStock: true },
  { retailer: 'lowes' as const, sku: 'LW-SCREW-DCK', name: 'Deck Plus #10 x 3-in Ceramic-Coated Star-Drive Deck Screws (5-lb)', category: 'fasteners', keywords: ['screw', 'deck', 'galvanized'], price: 22.98, unit: 'box', url: 'https://www.lowes.com/p/deck-screws', inStock: true },
  { retailer: 'lowes' as const, sku: 'LW-JH-206', name: 'USP LUS210Z Z-Max Joist Hanger for 2x6', category: 'hardware', keywords: ['joist', 'hanger'], price: 2.28, unit: 'each', url: 'https://www.lowes.com/p/joist-hanger', inStock: true },
  { retailer: 'lowes' as const, sku: 'LW-PA-4444', name: 'OZCO 4 x 4 Post Base', category: 'hardware', keywords: ['post', 'anchor', 'base'], price: 17.98, unit: 'each', url: 'https://www.lowes.com/p/post-anchor', inStock: true },
  { retailer: 'lowes' as const, sku: 'LW-STAIN-DECK', name: 'Cabot Australian Timber Oil Transparent Exterior Stain, 1 gal.', category: 'finishing', keywords: ['stain', 'sealer', 'deck'], price: 42.98, unit: 'gallon', url: 'https://www.lowes.com/p/cabot-stain', inStock: true },
];

async function seed() {
  await connectDatabase();
  await RetailProduct.deleteMany({});
  await RetailProduct.insertMany(CATALOG);
  console.log(`Seeded ${CATALOG.length} retail products`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
