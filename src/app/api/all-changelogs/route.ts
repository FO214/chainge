import { NextResponse } from 'next/server';
import connectMongoDB from '@/app/lib/mongodb';
import Changelog from '@/app/models/Changelog';

export async function GET() {
  await connectMongoDB(); // Connect to MongoDB

  // Fetch all changelogs from the database
  const changelogs = await Changelog.find({}); // Adjust the query as needed

  return NextResponse.json(changelogs);
}
