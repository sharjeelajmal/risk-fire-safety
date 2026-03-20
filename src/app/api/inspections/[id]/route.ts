import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Inspection from '@/models/Inspection';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    
    const inspection = await Inspection.findById(id);
    
    const inspectionJson = inspection.toObject();
    if (!inspectionJson.issues) inspectionJson.issues = [];

    return NextResponse.json(inspectionJson);
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Server fout bij het ophalen van de inspectie' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();

    const { datum, auftraggeber, teilnehmer, documentType, participants, generalNotes } = body;

    const updateData: Record<string, any> = {};
    if (datum !== undefined) updateData.datum = datum;
    if (auftraggeber !== undefined) updateData.auftraggeber = auftraggeber;
    if (teilnehmer !== undefined) updateData.teilnehmer = teilnehmer;
    if (documentType !== undefined) updateData.documentType = documentType;
    if (participants !== undefined) updateData.participantsList = participants;
    if (generalNotes !== undefined) updateData.generalNotes = generalNotes;

    const updated = await Inspection.findByIdAndUpdate(id, { $set: updateData }, { new: true });

    if (!updated) {
      return NextResponse.json({ error: 'Inspektion nicht gefunden' }, { status: 404 });
    }

    return NextResponse.json(updated.toObject());
  } catch (error: any) {
    console.error('API PUT Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    
    const deletedInspection = await Inspection.findByIdAndDelete(id);
    
    if (!deletedInspection) {
      return NextResponse.json({ error: 'Inspektion nicht gefunden' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Inspektion erfolgreich gelöscht' });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

