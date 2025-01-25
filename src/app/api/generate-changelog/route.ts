import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';
import connectMongoDB from '@/app/lib/mongodb';
import Commit from '@/app/models/Commit';
import Changelog from '@/app/models/Changelog';

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  const { commits, owner, repo, accessToken } = await request.json();
  
  console.log('Access Token:', accessToken);
  console.log('Commits:', commits);
  
  await connectMongoDB(); // Connect to MongoDB

  // Filter out commits that are already in the database
  //@ts-ignore
  const newCommits = await Promise.all(commits.map(async (commit) => {
    const existingCommit = await Commit.findOne({ sha: commit.sha });
    if (!existingCommit) {
      // If the commit doesn't exist, create a new one
      const newCommit = new Commit({
        sha: commit.sha,
        message: commit.message,
        date: commit.date,
        changelogGenerated: false,
      });
      await newCommit.save();
      return commit;
    }
    return null;
  }));

  const filteredCommits = newCommits.filter(commit => commit !== null);

  if (filteredCommits.length === 0) {
    console.log('No new commits to process for changelog generation.');
    return NextResponse.json({ message: 'No new commits to summarize.' });
  }

  const changelog = await generateChangelog(filteredCommits, owner, repo, accessToken);
  
  // Save the generated changelog to the database
  console.log(owner, repo);
  const newChangelog = new Changelog({
    title: `Changelog for ${repo}`,
    date: new Date(),
    content: changelog,
    owner: owner,
    repo: repo,
  });

  console.log('Generated Changelog:', newChangelog);

  await newChangelog.save(); // Save the changelog to the database

  return NextResponse.json({ changelog });
}
//@ts-ignore
async function generateChangelog(commits, owner, repo, accessToken) {
  const changelogEntries = [];
  const codeChangesPromises = [];

  for (const commit of commits) {
    const existingCommit = await Commit.findOne({ sha: commit.sha });
    if (!existingCommit || !existingCommit.changelogGenerated) {
      changelogEntries.push(`- ${commit.message || 'No message'} (on ${new Date(commit.date).toLocaleDateString()})`);
      codeChangesPromises.push(fetchCodeChanges(commit, owner, repo, accessToken));
    }
  }

  const codeChanges = await Promise.all(codeChangesPromises);
  const changelogSummary = changelogEntries.join('\n') + '\n\n' + codeChanges.join('\n\n');

  // Call Groq API to summarize the changes
  const groqResponse = await client.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant that generates changelogs from commit messages and code changes, take the code and mention any key changes with proper examples of the any potentially new implementations and any important changes to the code. Do not add a title for Changlogs above, just write the changelog. You can use emojis when you would like to and try to be as friendly to the user as possible, examples are always appreciated!'
      },
      {
        role: 'user',
        content: `Please summarize the following changes in a markdown changelog format:\n\n${changelogSummary}`
      }
    ],
    model: 'llama-3.3-70b-versatile',
  });

  const summary = groqResponse.choices[0].message.content;

  // Mark commits as having generated changelogs
  await Commit.updateMany(
    //@ts-ignore
    { sha: { $in: commits.map(commit => commit.sha) } },
    { changelogGenerated: true }
  );

  return `# Changelog\n\n${summary}`;
}

//@ts-ignore
async function fetchCodeChanges(commit, owner, repo, accessToken) {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits/${commit.sha}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorMessage = await response.json();
    console.error(`Error fetching commit ${commit.sha}:`, errorMessage);
    return { commitSha: commit.sha, diff: `Error fetching changes - ${errorMessage.message}` };
  }

  const diffResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits/${commit.sha}`, {
    headers: {
      Accept: 'application/vnd.github.v3.diff',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!diffResponse.ok) {
    const errorMessage = await diffResponse.text();
    console.error(`Error fetching diff for commit ${commit.sha}:`, errorMessage);
    return { commitSha: commit.sha, diff: `Error fetching diff - ${errorMessage}` };
  }

  const diff = await diffResponse.text();
  return { commitSha: commit.sha, diff };
}

export async function GET() {
  await connectMongoDB(); // Connect to MongoDB

  // Fetch changelogs from the database
  const changelogs = await Changelog.find({}); // Adjust the query as needed

  return NextResponse.json(changelogs);
}
