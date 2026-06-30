import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { StoreModel } from '@/models/Store';

// We simulate a single user environment. In a real app, you'd get this from NextAuth or Clerk.
const DEFAULT_USER_ID = 'user-1';

export async function GET() {
  try {
    await connectToDatabase();
    const userStore = await StoreModel.findOne({ userId: DEFAULT_USER_ID });
    
    if (userStore) {
      return NextResponse.json({ store: userStore.storeData });
    }
    
    return NextResponse.json({ store: null });
  } catch (error) {
    console.error('Error fetching store from DB:', error);
    return NextResponse.json({ error: 'Failed to fetch store' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { store } = body;

    if (!store) {
      return NextResponse.json({ error: 'No store data provided' }, { status: 400 });
    }

    await connectToDatabase();
    
    // Upsert the store data for the user
    await StoreModel.findOneAndUpdate(
      { userId: DEFAULT_USER_ID },
      { storeData: store },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving store to DB:', error);
    return NextResponse.json({ error: 'Failed to save store' }, { status: 500 });
  }
}
