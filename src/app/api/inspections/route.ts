import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Inspection from '@/models/Inspection';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
    const file = formData.get('floorPlan') as File;

    if (!ort || !auftraggeber || !file) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Convert file to base64 for Cloudinary uploader.upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString('base64');
    const fileUri = `data:${file.type};base64,${base64Data}`;

    console.log(`Cloudinary Config: Cloud=${process.env.CLOUDINARY_CLOUD_NAME}, KeyExists=${!!process.env.CLOUDINARY_API_KEY}`);
    console.log(`Uploading to Cloudinary: ${ort}, Size: ${buffer.length} bytes`);

    // Upload to Cloudinary with explicit timeout
    try {
      const uploadResponse = await cloudinary.uploader.upload(fileUri, {
        folder: 'risk-fire-safety/floor-plans',
        resource_type: 'auto',
        timeout: 60000, 
      });

      const floorPlanUrl = uploadResponse.secure_url;
      console.log('Upload successful:', floorPlanUrl);
      
      // Save to MongoDB
      const newInspection = await Inspection.create({
        ort,
        datum: new Date(datum),
        auftraggeber,
        teilnehmer,
        floorPlanUrl,
        status: 'Draft'
      });

      return NextResponse.json({ 
        message: 'Inspectie succesvol aangemaakt', 
        id: newInspection._id 
      }, { status: 201 });

    } catch (uploadErr: any) {
      console.error('Cloudinary Upload Call failed:', uploadErr);
      return NextResponse.json({ 
        error: `Cloudinary Fout: ${uploadErr.message || 'Onbekende fout'}`,
        details: uploadErr 
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
