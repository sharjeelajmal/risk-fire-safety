import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Inspection from '@/models/Inspection';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; issueId: string }> }
) {
  try {
    await connectToDatabase();
    const { id, issueId } = await params;
    const body = await request.json();

    const result = await Inspection.updateOne(
      { _id: id, 'issues._id': issueId },
      { 
        $set: { 
          'issues.$.location': body.location,
          'issues.$.responsibleContractor': body.responsibleContractor,
          'issues.$.description': body.description,
          'issues.$.measures': body.measures,
          'issues.$.category': body.category,
          'issues.$.priority': body.priority,
          'issues.$.images': body.images,
          'issues.$.status': body.status || 'Open',
          'issues.$.floorPlanId': body.floorPlanId
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Inspection or Issue not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Issue updated successfully' });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to update issue' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; issueId: string }> }
) {
  try {
    await connectToDatabase();
    const { id, issueId } = await params;

    const result = await Inspection.updateOne(
      { _id: id },
      { $pull: { issues: { _id: issueId } } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Inspection not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Issue deleted successfully' });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to delete issue' }, { status: 500 });
  }
}
