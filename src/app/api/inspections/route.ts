import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Inspection from '@/models/Inspection';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    await connectToDatabase();
    const inspections = await Inspection.find({}).sort({ createdAt: -1 });
    return NextResponse.json(inspections);
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    
    // Check if the request is multipart/form-data
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'Expected multipart/form-data' }, { status: 400 });
    }

    const formData = await request.formData();
    const ort = formData.get('ort') as string;
    const datum = formData.get('datum') as string;
    const auftraggeber = formData.get('auftraggeber') as string;
    const teilnehmer = formData.get('teilnehmer') as string;
    const documentType = formData.get('documentType') as string;
    const participantsRaw = formData.get('participants') as string;
    const floorPlansDataRaw = formData.get('floorPlansData') as string;
    const generalNotesRaw = formData.get('generalNotes') as string;

    if (!ort || !auftraggeber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let participants = [];
    try {
      if (participantsRaw) {
        participants = JSON.parse(participantsRaw);
      }
    } catch (e) {
      console.error('Error parsing participants:', e);
    }

    let floorPlansData = [];
    try {
      if (floorPlansDataRaw) {
        floorPlansData = JSON.parse(floorPlansDataRaw);
      }
    } catch (e) {
      console.error('Error parsing floorPlansData:', e);
    }

    let generalNotes: string[] = [];
    try {
      if (generalNotesRaw) {
        generalNotes = JSON.parse(generalNotesRaw);
      }
    } catch (e) {
      console.error('Error parsing generalNotes:', e);
    }

    const floorPlans = [];

    // Loop through floorPlansData and find corresponding files in formData
    for (let i = 0; i < floorPlansData.length; i++) {
        const planData = floorPlansData[i];
        const file = formData.get(`file_${i}`) as File | null;

        if (file && file.size > 0) {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const base64Data = buffer.toString('base64');
            const fileUri = `data:${file.type};base64,${base64Data}`;

            console.log(`Uploading floor plan ${planData.name} to Cloudinary...`);

            try {
                const uploadResponse = await cloudinary.uploader.upload(fileUri, {
                    folder: 'risk-fire-safety/floor-plans',
                    resource_type: 'auto',
                    timeout: 60000,
                });

                floorPlans.push({
                    id: planData.id,
                    name: planData.name,
                    url: uploadResponse.secure_url
                });
            } catch (uploadErr: any) {
                console.error(`Cloudinary Upload for ${planData.name} failed:`, uploadErr);
                return NextResponse.json({ 
                    error: `Cloudinary Fehler (${planData.name}): ${uploadErr.message || 'Unbekannter Fehler'}`
                }, { status: 500 });
            }
        }
    }
      
    // Save to MongoDB
    const newInspection = await Inspection.create({
      ort,
      datum: new Date(datum),
      auftraggeber,
      teilnehmer,
      documentType,
      participantsList: participants,
      generalNotes,
      floorPlans,
      status: 'Draft'
    });

    return NextResponse.json({ 
      message: 'Inspektion erfolgreich erstellt', 
      id: newInspection._id 
    }, { status: 201 });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
