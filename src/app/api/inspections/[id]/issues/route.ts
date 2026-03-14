import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Inspection from '@/models/Inspection';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();

    const inspection = await Inspection.findById(id);
    if (!inspection) {
      return NextResponse.json({ error: 'Inspection not found' }, { status: 404 });
    }

    // Auto-calculate issue number
    const issueNumber = (inspection.issues?.length || 0) + 1;

    const newIssue = {
      ...body,
      issueNumber,
      createdAt: new Date(),
      status: 'Open'
    };

    // Push the new issue to the issues array
    inspection.issues.push(newIssue);
    await inspection.save();

    return NextResponse.json({ success: true, issue: newIssue });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to add issue' }, { status: 500 });
  }
}
