import mongoose, { Schema, Document } from 'mongoose';

export interface IIssue {
  _id?: string;
  issueNumber: string;
  x: number;
  y: number;
  location: string;
  responsibleContractor: string;
  description: string;
  measures: string;
  priority: '1' | '2' | '3' | 'n/a';
  images: string[];
  status: 'Offen' | 'in Arbeit' | 'abgeschlossen' | 'N/A';
  floorPlanId: string;
  createdAt: Date;
}

export interface IInspection extends Document {
  datum: Date;
  auftraggeber: string;
  teilnehmer: string;
  documentType: 'Catalog of measures' | 'QS protocol';
  participantsList: { name: string; role: string }[];
  generalNotes: string[];
  floorPlans: { id: string; name: string; url: string }[];
  issues: IIssue[];
  status: 'Draft' | 'In Progress' | 'Completed';
  createdAt: Date;
  updatedAt: Date;
}

const ParticipantSchema = new Schema({
  name: { type: String },
  role: { type: String }
}, { _id: false });

const FloorPlanSchema = new Schema({
  id: { type: String },
  name: { type: String },
  url: { type: String }
}, { _id: false });

const InspectionSchema: Schema = new Schema({
  datum: { type: Date, default: Date.now },
  auftraggeber: { type: String, required: false },
  teilnehmer: { type: String, required: true },
  documentType: { type: String, enum: ['Catalog of measures', 'QS protocol'], default: 'Catalog of measures' },
  participantsList: [ParticipantSchema],
  generalNotes: [{ type: String }],
  floorPlans: [FloorPlanSchema],
  issues: [
    {
      issueNumber: { type: String, required: true },
      x: { type: Number, required: true },
      y: { type: Number, required: true },
      location: { type: String, default: "" },
      responsibleContractor: { type: String, default: "" },
      description: { type: String, default: "" },
      measures: { type: String, default: "" },
      priority: { type: String, enum: ['1', '2', '3', 'n/a'], default: '1' },
      images: [{ type: String }],
      status: { type: String, enum: ['Offen', 'in Arbeit', 'abgeschlossen', 'N/A'], default: 'Offen' },
      floorPlanId: { type: String },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  status: { type: String, enum: ['Draft', 'In Progress', 'Completed'], default: 'Draft' },
}, { timestamps: true });

// Force model refresh for development
if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.Inspection;
}

const Inspection = mongoose.models.Inspection || mongoose.model<IInspection>('Inspection', InspectionSchema);

export default Inspection;
