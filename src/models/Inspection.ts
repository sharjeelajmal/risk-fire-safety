import mongoose, { Schema, Document } from 'mongoose';

export interface IIssue {
  x: number;
  y: number;
  description?: string;
  type?: string;
  createdAt: Date;
}

export interface IInspection extends Document {
  ort: string;
  datum: Date;
  auftraggeber: string;
  teilnehmer: string;
  floorPlanUrl: string;
  issues: IIssue[];
  status: 'Draft' | 'In Progress' | 'Completed';
  createdAt: Date;
  updatedAt: Date;
}

const InspectionSchema: Schema = new Schema({
  ort: { type: String, required: true },
  datum: { type: Date, default: Date.now },
  auftraggeber: { type: String, required: true },
  teilnehmer: { type: String, required: true },
  floorPlanUrl: { type: String, required: true },
  issues: [
    {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
      description: { type: String },
      type: { type: String },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  status: { type: String, enum: ['Draft', 'In Progress', 'Completed'], default: 'Draft' },
}, { timestamps: true });

export default mongoose.models.Inspection || mongoose.model<IInspection>('Inspection', InspectionSchema);
