import { MaterialItem, ProductMatch, CostBreakdown } from '../types';
import { calculateMaterialTotals } from './retailCatalog';

const REGION_MULTIPLIERS: Record<string, number> = {
  'US-National': 1.0,
  'US-Northeast': 1.15,
  'US-Southeast': 0.92,
  'US-Midwest': 0.95,
  'US-West': 1.12,
  'US-Southwest': 0.98,
};

const LABOR_RATES: Record<string, number> = {
  beginner: 45,
  intermediate: 55,
  advanced: 75,
};

const PROJECT_LABOR_HOURS: Record<string, number> = {
  deck: 40,
  fence: 24,
  pergola: 32,
  shed: 48,
  garage: 120,
  basement_renovation: 80,
  outdoor_kitchen: 60,
  other: 36,
};

const PERMIT_COSTS: Record<string, number> = {
  deck: 150,
  fence: 75,
  pergola: 100,
  shed: 50,
  garage: 350,
  basement_renovation: 250,
  outdoor_kitchen: 200,
  other: 100,
};

export function estimateCosts(
  materials: MaterialItem[],
  products: ProductMatch[],
  complexity: 'beginner' | 'intermediate' | 'advanced',
  projectType: string,
  region: string
): CostBreakdown {
  const regionalMultiplier = REGION_MULTIPLIERS[region] || 1.0;
  const materialBase = calculateMaterialTotals(materials, products);
  const materialsCost = Math.round(materialBase * regionalMultiplier);

  const laborHours = PROJECT_LABOR_HOURS[projectType] || PROJECT_LABOR_HOURS.other;
  const complexityMultiplier = complexity === 'advanced' ? 1.3 : complexity === 'intermediate' ? 1.15 : 1.0;
  const laborCost = Math.round(laborHours * LABOR_RATES[complexity] * complexityMultiplier * regionalMultiplier);

  const permitBase = PERMIT_COSTS[projectType] || PERMIT_COSTS.other;
  const permits = Math.round(permitBase * regionalMultiplier);

  const total = materialsCost + laborCost + permits;

  return {
    materials: materialsCost,
    labor: laborCost,
    permits,
    total,
    regionalMultiplier,
  };
}

export function getAvailableRegions(): string[] {
  return Object.keys(REGION_MULTIPLIERS);
}
