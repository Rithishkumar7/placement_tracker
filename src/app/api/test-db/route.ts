import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

export async function GET() {
  const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://rithishjanjeerapu007:rithesh01@rithesh.3fcrg3x.mongodb.net/placement_tracker?retryWrites=true&w=majority";
  
  try {
    // Attempt a completely fresh connection with a short 5 second timeout
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    const state = mongoose.connection.readyState;
    
    return NextResponse.json({ 
      success: true, 
      message: "Successfully connected to MongoDB Atlas!",
      readyState: state
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      message: "Failed to connect to MongoDB Atlas.",
      errorName: error?.name,
      errorMessage: error?.message,
      uriUsed: MONGODB_URI.replace(/:\/\/[^:]+:[^@]+@/, '://***:***@')
    }, { status: 500 });
  }
}
