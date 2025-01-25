'use client';

import { useSession } from "next-auth/react";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/app/components/Modal";
import BackButton from "@/app/components/BackButton";
import HomeButton from "@/app/components/HomeButton";
import 'react-toastify/dist/ReactToastify.css';
import React from 'react';

interface Commit {
  sha: string;
  message: string;
  date: string;
}

interface Changelog {
  title: string;
  date: string;
  content: string;
  owner: string;
  repo: string;
}

interface PageParams {
  owner: string;
  repo: string;
}

const CommitGraph: React.FC<{ commits: Commit[] }> = ({ commits }) => {
  if (commits.length === 0) {
    return <div className="text-center text-gray-500">No commits available for this repository.</div>;
  }

  const dates = commits.map(commit => new Date(commit.date).getTime());
  const minDate = Math.min(...dates);
  const maxDate = Math.max(...dates);
  const range = maxDate - minDate;

  const spacing = 95 / (commits.length - 1);

  return (
    <div className="commit-graph">
      {commits.map((commit, index) => {
        const position = index * spacing;
        return (
          <div
            key={commit.sha}
            className={`commit-node ${index === 0 ? 'start' : ''}`}
            style={{ left: `${index === 0 ? 0 : position}%`, animationDelay: `${index * 0.1}s` }}
            title={`${new Date(commit.date).toLocaleString()}: ${commit.message}`}
          >
            <div className="commit-dot" />
          </div>
        );
      })}
      {commits.length > 1 && (
        <div className="commit-line" style={{ left: `50%`, bottom: '12.5px', width: '100%' }} />
      )}
    </div>
  );
};

export default function RepoChangelog({ params }: { params: Promise<PageParams> }) {
  const resolvedParams = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [commits, setCommits] = useState<Commit[]>([]);
  const [changelogs, setChangelogs] = useState<Changelog[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedChangelog, setSelectedChangelog] = useState<Changelog | null>(null);
  const [noNewCommitsPopup, setNoNewCommitsPopup] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    const fetchCommits = async () => {
      if (session?.accessToken) {
        try {
          const response = await fetch(`https://api.github.com/repos/${resolvedParams.owner}/${resolvedParams.repo}/commits`, {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          });


          const data = await response.json();

          // Check if data is an array and has commits
          if (Array.isArray(data)) {
            setCommits(data.map(commit => ({
              sha: commit.sha,
              message: commit.commit.message,
              date: commit.commit.author.date,
            })));
          } else {
            setCommits([]); // Set to empty if no commits
          }
        } catch (error) {
          console.error('Error fetching commits:', error);
          setCommits([]); // Set to empty on error
        } finally {
          setLoading(false);
        }
      }
    };

    const fetchChangelogs = async () => {
      const response = await fetch(`/api/changelogs?owner=${resolvedParams.owner}&repo=${resolvedParams.repo}`);
      const data = await response.json();
      setChangelogs(data);
    };

    fetchCommits();
    fetchChangelogs();
  }, [session, status, router, resolvedParams]);

  const generateChangelog = async () => {
    setGenerating(true);
    try {
      const response = await fetch('/api/generate-changelog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commits: commits.map(commit => ({
            sha: commit.sha,
            message: commit.message,
            date: commit.date,
          })),
          owner: resolvedParams.owner,
          repo: resolvedParams.repo,
          accessToken: session.accessToken,
        }),
      });

      const data = await response.json();
      if (data.message !== "No new commits to process for changelog generation.") {
        console.log(data.message);

        if (data.changelog) {
          // Fetch the latest changelogs after generating a new one
          await fetchChangelogs();
        } else {
          setNoNewCommitsPopup(true);
        }
      }
    } catch (error) {
      console.error('Error generating changelog:', error);
    } finally {
      setGenerating(false);
    }
  };

  const fetchChangelogs = async () => {
    const response = await fetch(`/api/changelogs?owner=${resolvedParams.owner}&repo=${resolvedParams.repo}`);
    const data = await response.json();
    setChangelogs(data);
  };

  const closeNoNewCommitsPopup = () => {
    setNoNewCommitsPopup(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-accent">Loading repository data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 relative">
      <HomeButton />
      <BackButton />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">
          {resolvedParams.owner}/{resolvedParams.repo}
        </h1>
        
        <div className="mb-8">
          <button
            onClick={generateChangelog}
            disabled={generating}
            className="px-6 py-3 rounded-full bg-accent text-background font-semibold glow-effect transition duration-300 ease-in-out hover:shadow-lg hover:scale-105 hover:bg-opacity-80"
          >
            {generating ? 'Generating...' : 'Generate Changelog'}
          </button>
          <button
            onClick={() => window.open(`https://github.com/${resolvedParams.owner}/${resolvedParams.repo}`, '_blank')}
            className="ml-4 px-6 py-3 rounded-full bg-blue-500 text-white font-semibold transition duration-300 ease-in-out hover:bg-blue-600"
          >
            View Repo
          </button>
        </div>

        {changelogs.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Changelog Previews</h2>
            {changelogs.map((changelog, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-surface cursor-pointer hover:bg-gray-700 hover:shadow-lg hover:scale-105 transition-transform border-2 border-transparent hover:border-green-500"
                onClick={() => setSelectedChangelog(changelog)}
              >
                <h3 className="font-semibold hover-glow">{changelog.title}</h3>
                <p className="text-gray-400">{changelog.date}</p>
              </div>
            ))}
          </div>
        )}
        
        <Modal
          isOpen={!!selectedChangelog}
          onClose={() => setSelectedChangelog(null)}
          title={selectedChangelog?.title || ''}
          content={selectedChangelog?.content || ''}
        />

        {noNewCommitsPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-surface p-6 rounded-lg shadow-lg max-w-lg w-full">
              <h2 className="text-2xl font-semibold mb-4">No New Commits</h2>
              <p>The Changelogs are up to date!</p>
              <button
                onClick={closeNoNewCommitsPopup}
                className="mt-4 px-4 py-2 rounded-full bg-red-500 text-background font-semibold hover:bg-red-600 transition duration-200"
              >
                Close
              </button>
            </div>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Recent Commits</h2>
          <CommitGraph commits={commits} />
        </div>
      </div>
    </div>
  );
}
