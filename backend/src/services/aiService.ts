import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { env } from '../config/env';
import { ProjectAnalysis } from '../types';
import { matchProducts } from './retailCatalog';
import { estimateCosts } from './costEstimator';

const openai = env.openaiApiKey ? new OpenAI({ apiKey: env.openaiApiKey }) : null;

const ANALYSIS_SCHEMA = `{
  "projectType": "string (deck, fence, pergola, shed, garage, basement_renovation, outdoor_kitchen, other)",
  "title": "string",
  "dimensions": {
    "length": number or null,
    "width": number or null,
    "height": number or null,
    "unit": "ft or m",
    "description": "string describing dimensions"
  },
  "complexity": "beginner | intermediate | advanced",
  "timeEstimate": "Weekend | 1 week | 2+ weeks",
  "summary": "2-3 sentence project summary",
  "materials": [
    {
      "name": "string",
      "quantity": number,
      "unit": "string (boards, bags, lbs, etc)",
      "category": "lumber | fasteners | hardware | concrete | finishing | other",
      "wasteFactor": number (0.05 to 0.15),
      "notes": "optional string"
    }
  ],
  "phases": [
    {
      "phase": number,
      "title": "string",
      "steps": ["detailed step strings"],
      "tools": ["tool names"],
      "safetyNotes": ["safety notes"],
      "estimatedHours": number
    }
  ],
  "toolsRequired": ["all tools needed"],
  "safetyConsiderations": ["overall safety items"]
}`;

function buildMockAnalysis(description: string, region: string): Promise<ProjectAnalysis> {
  const isDeck = /deck/i.test(description);
  const dims = description.match(/(\d+)\s*[xX×]\s*(\d+)/);
  const length = dims ? parseInt(dims[1], 10) : 12;
  const width = dims ? parseInt(dims[2], 10) : 16;
  const sqft = length * width;

  const materials = isDeck || !description
    ? [
        { name: '2x6 Pressure-Treated Deck Boards', quantity: Math.ceil(sqft / 5.5), unit: 'boards', category: 'lumber', wasteFactor: 0.1 },
        { name: '2x8 Pressure-Treated Joists', quantity: Math.ceil(width / 1.5) + 2, unit: 'boards', category: 'lumber', wasteFactor: 0.1 },
        { name: '4x4 Pressure-Treated Posts', quantity: Math.ceil(length / 8) * 2 + 2, unit: 'posts', category: 'lumber', wasteFactor: 0.05 },
        { name: 'Concrete Mix (80 lb bags)', quantity: Math.ceil((Math.ceil(length / 8) * 2 + 2) * 1.5), unit: 'bags', category: 'concrete', wasteFactor: 0.1 },
        { name: 'Galvanized Deck Screws (#10 x 3")', quantity: Math.ceil(sqft * 2), unit: 'screws', category: 'fasteners', wasteFactor: 0.15 },
        { name: 'Joist Hangers', quantity: Math.ceil(width / 1.5) * 2, unit: 'hangers', category: 'hardware', wasteFactor: 0.05 },
        { name: 'Post Anchors', quantity: Math.ceil(length / 8) * 2 + 2, unit: 'anchors', category: 'hardware', wasteFactor: 0.05 },
        { name: 'Deck Stain/Sealer', quantity: Math.ceil(sqft / 200), unit: 'gallons', category: 'finishing', wasteFactor: 0.1 },
      ]
    : [
        { name: 'Pressure-Treated Lumber (2x4)', quantity: 20, unit: 'boards', category: 'lumber', wasteFactor: 0.1 },
        { name: 'Concrete Mix (80 lb bags)', quantity: 6, unit: 'bags', category: 'concrete', wasteFactor: 0.1 },
        { name: 'Galvanized Screws', quantity: 200, unit: 'screws', category: 'fasteners', wasteFactor: 0.15 },
        { name: 'Post Anchors', quantity: 4, unit: 'anchors', category: 'hardware', wasteFactor: 0.05 },
      ];

  const base: Omit<ProjectAnalysis, 'products' | 'costs'> = {
    projectType: isDeck ? 'deck' : 'other',
    title: isDeck ? `${length}x${width} Attached Deck` : 'Custom Build Project',
    dimensions: {
      length,
      width,
      unit: 'ft',
      description: `${length} ft × ${width} ft`,
    },
    complexity: sqft > 200 ? 'intermediate' : 'beginner',
    timeEstimate: sqft > 200 ? '1 week' : 'Weekend',
    summary: `A ${length}x${width} ${isDeck ? 'pressure-treated deck' : 'construction project'} with standard framing, footings, and finishing. Designed for residential DIY or contractor execution.`,
    materials,
    phases: [
      {
        phase: 1,
        title: 'Planning & Permits',
        steps: [
          'Verify local building codes and setback requirements',
          'Call 811 to locate underground utilities before digging',
          'Mark post locations and confirm dimensions on site',
          'Apply for building permit if required by municipality',
        ],
        tools: ['Measuring tape', 'String line', 'Spray paint'],
        safetyNotes: ['Check HOA rules if applicable'],
        estimatedHours: 4,
      },
      {
        phase: 2,
        title: 'Foundation & Framing',
        steps: [
          'Dig post holes 36" deep (below frost line in cold climates)',
          'Set posts in concrete and allow 24-48 hours to cure',
          'Install ledger board to house with lag bolts',
          'Attach beam and install joists at 16" on center',
          'Add blocking and rim joists for stability',
        ],
        tools: ['Post hole digger', 'Level', 'Circular saw', 'Drill/driver'],
        safetyNotes: ['Wear eye and ear protection', 'Ensure posts are plumb before concrete sets'],
        estimatedHours: 16,
      },
      {
        phase: 3,
        title: 'Decking & Finishing',
        steps: [
          'Install deck boards perpendicular to joists with 1/8" gap',
          'Pre-drill near board ends to prevent splitting',
          'Trim overhang and install fascia boards',
          'Apply deck stain or sealer per manufacturer specs',
          'Schedule final inspection if permit was required',
        ],
        tools: ['Miter saw', 'Impact driver', 'Paint roller'],
        safetyNotes: ['Maintain consistent screw spacing', 'Allow stain to dry 24-48 hours before use'],
        estimatedHours: 12,
      },
    ],
    toolsRequired: ['Circular saw', 'Drill/driver', 'Level', 'Post hole digger', 'Measuring tape', 'Miter saw'],
    safetyConsiderations: [
      'Always wear safety glasses and hearing protection',
      'Use GFCI outlets for power tools outdoors',
      'Never work alone when setting heavy beams',
      'Follow manufacturer load ratings for hardware',
    ],
  };

  return finalizeAnalysis(base, region);
}

async function finalizeAnalysis(
  partial: Omit<ProjectAnalysis, 'products' | 'costs'>,
  region: string
): Promise<ProjectAnalysis> {
  const products = await matchProducts(partial.materials);
  const costs = estimateCosts(partial.materials, products, partial.complexity, partial.projectType, region);
  return { ...partial, products, costs };
}

async function analyzeWithOpenAI(
  description: string,
  sketchPath: string | null,
  region: string
): Promise<ProjectAnalysis> {
  if (!openai) {
    return buildMockAnalysis(description, region);
  }

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: `You are BuildWise AI, an expert construction planner. Analyze construction projects and return ONLY valid JSON matching this schema:\n${ANALYSIS_SCHEMA}`,
    },
    {
      role: 'user',
      content: [
        { type: 'text', text: `Analyze this project for region "${region}":\n${description}` },
      ],
    },
  ];

  if (sketchPath && fs.existsSync(sketchPath)) {
    const ext = path.extname(sketchPath).toLowerCase();
    if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
      const imageData = fs.readFileSync(sketchPath).toString('base64');
      const mime = ext === '.png' ? 'image/png' : ext === '.gif' ? 'image/gif' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
      (messages[1].content as OpenAI.Chat.ChatCompletionContentPart[]).push({
        type: 'image_url',
        image_url: { url: `data:${mime};base64,${imageData}` },
      });
    }
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages,
    response_format: { type: 'json_object' },
    max_tokens: 4096,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('AI returned empty response');

  const parsed = JSON.parse(content) as Omit<ProjectAnalysis, 'products' | 'costs'>;
  return finalizeAnalysis(parsed, region);
}

export async function analyzeProject(
  description: string,
  sketchPath: string | null,
  region: string
): Promise<ProjectAnalysis> {
  try {
    return await analyzeWithOpenAI(description, sketchPath, region);
  } catch (error) {
    console.warn('AI analysis failed, using mock:', error);
    return buildMockAnalysis(description, region);
  }
}
