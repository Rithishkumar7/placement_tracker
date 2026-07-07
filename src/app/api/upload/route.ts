import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename to prevent overriding
    const uniqueId = Math.random().toString(36).substr(2, 9);
    const originalName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_'); // sanitize filename
    const filename = `${uniqueId}-${originalName}`;
    const path = join(process.cwd(), 'public/uploads', filename);

    // Save the file
    await writeFile(path, buffer);

    return NextResponse.json({ success: true, url: `/uploads/${filename}` });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
