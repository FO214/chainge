import { NextResponse } from 'next/server';
import connectMongoDB from '@/app/lib/mongodb';
import Changelog from '@/app/models/Changelog';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const owner = searchParams.get('owner');
  const repo = searchParams.get('repo');

  await connectMongoDB(); // Connect to MongoDB

  // Fetch changelogs from the database for the specific owner and repo
  const changelogs = await Changelog.find({ owner, repo });

  return NextResponse.json(changelogs);
}
