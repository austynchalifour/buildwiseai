import { MaterialItem, ProductMatch } from '../types';
import { RetailProduct } from '../models/RetailProduct';

function scoreProduct(product: { name: string; keywords: string[]; category: string }, material: MaterialItem): number {
  const materialWords = material.name.toLowerCase().split(/\W+/);
  let score = 0;

  for (const word of materialWords) {
    if (word.length < 3) continue;
    if (product.name.toLowerCase().includes(word)) score += 3;
    if (product.keywords.some((k) => k.includes(word) || word.includes(k))) score += 2;
  }

  if (product.category === material.category) score += 2;
  return score;
}

export async function matchProducts(materials: MaterialItem[]): Promise<ProductMatch[]> {
  const catalog = await RetailProduct.find({ inStock: true }).lean();
  const matches: ProductMatch[] = [];

  for (const material of materials) {
    const hdProducts = catalog.filter((p) => p.retailer === 'home_depot');
    const lowesProducts = catalog.filter((p) => p.retailer === 'lowes');

    const bestHd = hdProducts
      .map((p) => ({ product: p, score: scoreProduct(p, material) }))
      .sort((a, b) => b.score - a.score)[0];

    const bestLowes = lowesProducts
      .map((p) => ({ product: p, score: scoreProduct(p, material) }))
      .sort((a, b) => b.score - a.score)[0];

    const pick = bestHd && bestLowes
      ? bestHd.score >= bestLowes.score ? bestHd : bestLowes
      : bestHd || bestLowes;

    if (pick && pick.score > 0) {
      const p = pick.product;
      matches.push({
        materialName: material.name,
        retailer: p.retailer,
        productName: p.name,
        sku: p.sku,
        price: p.price,
        url: p.url,
        inStock: p.inStock,
      });
    } else {
      matches.push({
        materialName: material.name,
        retailer: 'home_depot',
        productName: `${material.name} (Generic)`,
        sku: 'N/A',
        price: estimateFallbackPrice(material),
        url: 'https://www.homedepot.com',
        inStock: true,
        substitute: 'Search retailer catalog for closest match',
      });
    }
  }

  return matches;
}

function estimateFallbackPrice(material: MaterialItem): number {
  const categoryPrices: Record<string, number> = {
    lumber: 12,
    fasteners: 0.15,
    hardware: 3,
    concrete: 6,
    finishing: 35,
    other: 10,
  };
  const unitPrice = categoryPrices[material.category] || 10;
  return Math.round(unitPrice * material.quantity * (1 + material.wasteFactor) * 100) / 100;
}

export function calculateMaterialTotals(materials: MaterialItem[], products: ProductMatch[]): number {
  return products.reduce((sum, product, i) => {
    const material = materials[i];
    if (!material) return sum + product.price;
    const qty = material.quantity * (1 + (material.wasteFactor || 0));
    return sum + product.price * Math.max(1, Math.ceil(qty / 10));
  }, 0);
}
