import mongoose, { Schema, Document } from 'mongoose';

export interface IIssue {
  _id?: string;
  issueNumber: number;
  x: number;
  y: number;
  location: string;
  responsibleContractor: string;
  description: string;
  measures: string;
  priority: '1' | '2' | '3';
  images: string[];
  status: 'Open' | 'Resolved';
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
      issueNumber: { type: Number, required: true },
      x: { type: Number, required: true },
      y: { type: Number, required: true },
      location: { type: String, required: true },
      responsibleContractor: { type: String, required: true },
      description: { type: String, required: true },
      measures: { type: String, required: true },
      priority: { type: String, enum: ['1', '2', '3'], default: '1' },
      images: [{ type: String }],
      status: { type: String, enum: ['Open', 'Resolved'], default: 'Open' },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  status: { type: String, enum: ['Draft', 'In Progress', 'Completed'], default: 'Draft' },
}, { timestamps: true });

export default mongoose.models.Inspection || mongoose.model<IInspection>('Inspection', InspectionSchema);
