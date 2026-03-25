import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Inspection from '@/models/Inspection';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
    
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'Expected multipart/form-data' }, { status: 400 });
    }

    const formData = await request.formData();
    const datum = formData.get('datum') as string;
    const auftraggeber = formData.get('auftraggeber') as string;
    const teilnehmer = formData.get('teilnehmer') as string;
    const documentType = formData.get('documentType') as string;
    const participantsRaw = formData.get('participants') as string;
    const generalNotesRaw = formData.get('generalNotes') as string;
    const floorPlansDataRaw = formData.get('floorPlansData') as string;

    const updateData: Record<string, any> = {};
    if (datum) updateData.datum = new Date(datum);
    if (auftraggeber !== null) updateData.auftraggeber = auftraggeber;
    if (teilnehmer !== null) updateData.teilnehmer = teilnehmer;
    if (documentType) updateData.documentType = documentType;

    if (participantsRaw) {
      try {
        updateData.participantsList = JSON.parse(participantsRaw);
      } catch (e) {
        console.error('Error parsing participants:', e);
      }
    }

    if (generalNotesRaw) {
      try {
        updateData.generalNotes = JSON.parse(generalNotesRaw);
      } catch (e) {
        console.error('Error parsing generalNotes:', e);
      }
    }

    let floorPlansData = [];
    if (floorPlansDataRaw) {
      try {
        floorPlansData = JSON.parse(floorPlansDataRaw);
      } catch (e) {
        console.error('Error parsing floorPlansData:', e);
      }
    }

    const updatedFloorPlans = [];

    // Process floor plans
    for (let i = 0; i < floorPlansData.length; i++) {
      const planData = floorPlansData[i];
      const file = formData.get(`file_${i}`) as File | null;

      if (file && file.size > 0) {
        // New file uploaded
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Data = buffer.toString('base64');
        const fileUri = `data:${file.type};base64,${base64Data}`;

        console.log(`Uploading new floor plan ${planData.name} to Cloudinary...`);

        try {
          const uploadResponse = await cloudinary.uploader.upload(fileUri, {
            folder: 'risk-fire-safety/floor-plans',
            resource_type: 'auto',
            timeout: 60000,
          });

          updatedFloorPlans.push({
            id: planData.id,
            name: planData.name,
            url: uploadResponse.secure_url,
          });
        } catch (uploadErr: any) {
          console.error(`Cloudinary Upload for ${planData.name} failed:`, uploadErr);
          return NextResponse.json({ 
            error: `Cloudinary Fehler (${planData.name}): ${uploadErr.message || 'Unbekannter Fehler'}`
          }, { status: 500 });
        }
      } else if (planData.url) {
        // Existing file preserved
        updatedFloorPlans.push({
          id: planData.id,
          name: planData.name,
          url: planData.url,
        });
      }
    }

    updateData.floorPlans = updatedFloorPlans;

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

