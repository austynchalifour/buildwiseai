export interface MaterialItem {
  name: string;
  quantity: number;
  unit: string;
  category: string;
  wasteFactor: number;
  notes?: string;
}

export interface ProductMatch {
  materialName: string;
  retailer: 'home_depot' | 'lowes';
  productName: string;
  sku: string;
  price: number;
  url: string;
  inStock: boolean;
  substitute?: string;
}

export interface BuildPhase {
  phase: number;
  title: string;
  steps: string[];
  tools: string[];
  safetyNotes: string[];
  estimatedHours: number;
}

export interface CostBreakdown {
  materials: number;
  labor: number;
  permits: number;
  total: number;
  regionalMultiplier: number;
}

export interface ProjectAnalysis {
  projectType: string;
  title: string;
  dimensions: {
    length?: number;
    width?: number;
    height?: number;
    unit: string;
    description: string;
  };
  complexity: 'beginner' | 'intermediate' | 'advanced';
  timeEstimate: string;
  summary: string;
  materials: MaterialItem[];
  products: ProductMatch[];
  costs: CostBreakdown;
  phases: BuildPhase[];
  toolsRequired: string[];
  safetyConsiderations: string[];
}

export interface JwtPayload {
  userId: string;
  email: string;
}
