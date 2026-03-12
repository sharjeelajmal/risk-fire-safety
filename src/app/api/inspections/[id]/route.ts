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
