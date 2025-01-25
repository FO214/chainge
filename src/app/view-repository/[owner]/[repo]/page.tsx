'use client';

import { useSession } from "next-auth/react";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/app/components/Modal";
import BackButton from "@/app/components/BackButton";
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


export default function RepoChangelog({ params }: { params: Promise<PageParams> }) {
  const resolvedParams = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [changelogs, setChangelogs] = useState<Changelog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChangelog, setSelectedChangelog] = useState<Changelog | null>(null);

  useEffect(() => {
    const fetchChangelogs = async () => {
      const response = await fetch(`/api/changelogs?owner=${resolvedParams.owner}&repo=${resolvedParams.repo}`);
      const data = await response.json();
      setChangelogs(data);
      setLoading(false);
    };

    fetchChangelogs();
  }, [session, status, router, resolvedParams]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-accent">Loading repository data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 relative">
      <BackButton />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">
          {resolvedParams.owner}/{resolvedParams.repo}
        </h1>
        
        <div className="mb-8">
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

      </div>
    </div>
  );
}
