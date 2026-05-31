import mongoose, { Document, Schema } from 'mongoose';

export interface IRetailProduct extends Document {
  retailer: 'home_depot' | 'lowes';
  sku: string;
  name: string;
  category: string;
  keywords: string[];
  price: number;
  unit: string;
  url: string;
  inStock: boolean;
}

const retailProductSchema = new Schema<IRetailProduct>(
  {
    retailer: { type: String, enum: ['home_depot', 'lowes'], required: true },
    sku: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    keywords: [{ type: String }],
    price: { type: Number, required: true },
    unit: { type: String, required: true },
    url: { type: String, required: true },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

retailProductSchema.index({ keywords: 1 });
retailProductSchema.index({ category: 1 });

export const RetailProduct = mongoose.model<IRetailProduct>('RetailProduct', retailProductSchema);
