import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { UploadModel } from '@/models/Upload';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uniqueId = Math.random().toString(36).substr(2, 9);
    const originalName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_'); // sanitize filename
    const filename = `${uniqueId}-${originalName}`;

    // Save to MongoDB
    const upload = new UploadModel({
      filename: filename,
      contentType: file.type || 'application/pdf',
      data: buffer
    });
    await upload.save();

    return NextResponse.json({ success: true, url: `/api/files/${upload._id}` });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
