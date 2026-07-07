import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { UploadModel } from '@/models/Upload';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await context.params;

    const upload = await UploadModel.findById(id);

    if (!upload) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    return new NextResponse(upload.data, {
      status: 200,
      headers: {
        'Content-Type': upload.contentType || 'application/pdf',
        'Content-Disposition': `inline; filename="${upload.filename}"`,
      },
    });
  } catch (error) {
    console.error('Error serving file:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
