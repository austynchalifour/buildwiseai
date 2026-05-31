import mongoose, { Document, Schema } from 'mongoose';
import { ProjectAnalysis } from '../types';

export type ProjectStatus = 'pending' | 'analyzing' | 'completed' | 'failed';

export interface IProject extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  sketchUrl?: string;
  sketchFilename?: string;
  status: ProjectStatus;
  analysis?: ProjectAnalysis;
  region?: string;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const materialSchema = new Schema(
  {
    name: String,
    quantity: Number,
    unit: String,
    category: String,
    wasteFactor: Number,
    notes: String,
  },
  { _id: false }
);

const productSchema = new Schema(
  {
    materialName: String,
    retailer: { type: String, enum: ['home_depot', 'lowes'] },
    productName: String,
    sku: String,
    price: Number,
    url: String,
    inStock: Boolean,
    substitute: String,
  },
  { _id: false }
);

const phaseSchema = new Schema(
  {
    phase: Number,
    title: String,
    steps: [String],
    tools: [String],
    safetyNotes: [String],
    estimatedHours: Number,
  },
  { _id: false }
);

const analysisSchema = new Schema(
  {
    projectType: String,
    title: String,
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      unit: String,
      description: String,
    },
    complexity: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
    timeEstimate: String,
    summary: String,
    materials: [materialSchema],
    products: [productSchema],
    costs: {
      materials: Number,
      labor: Number,
      permits: Number,
      total: Number,
      regionalMultiplier: Number,
    },
    phases: [phaseSchema],
    toolsRequired: [String],
    safetyConsiderations: [String],
  },
  { _id: false }
);

const projectSchema = new Schema<IProject>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, default: 'Untitled Project' },
    description: { type: String, required: true },
    sketchUrl: String,
    sketchFilename: String,
    status: {
      type: String,
      enum: ['pending', 'analyzing', 'completed', 'failed'],
      default: 'pending',
    },
    analysis: analysisSchema,
    region: { type: String, default: 'US-National' },
    errorMessage: String,
  },
  { timestamps: true }
);

export const Project = mongoose.model<IProject>('Project', projectSchema);
