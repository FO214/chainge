'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BackButton from "@/app/components/BackButton";

interface Repository {
  owner: string;
  repo: string;
  title: string;
  description: string;
}

const ViewChangelogs = () => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        const response = await fetch('/api/all-changelogs');
        if (!response.ok) {
          throw new Error('Failed to fetch repositories');
        }
        const data = await response.json();
        setRepositories(data);
      } catch (err) {
        setError('Error fetching repositories. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRepositories();
  }, []);

  const filteredRepos = repositories.filter(repo =>
    repo.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-accent">Loading repositories...</div>
      </div>
    );
  }

  return (
    <>
    <BackButton />
    <div className="max-w-6xl mx-auto p-8 relative">
      <h1 className="text-4xl font-bold mb-8">All Changelogs</h1>
      
      <input
        type="text"
        placeholder="Search repositories..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6 p-2 border border-gray-300 rounded w-full text-black"
      />

      {error && <p className="text-red-500">{error}</p>}
      {filteredRepos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRepos.map((repo) => (
            <div
              key={`${repo.owner}-${repo.repo}`}
              className="p-6 rounded-lg bg-surface card-glow cursor-pointer transition-transform transform hover:scale-105 hover:shadow-lg"
              onClick={() => router.push(`/view-repository/${repo.owner}/${repo.repo}`)}
            >
              <h3 className="text-xl font-semibold mb-2 hover-glow">{repo.title.split(' ').pop()}</h3>
              <p className="text-gray-400 text-sm mb-4">
                {repo.description || 'No description available'}
              </p>
              <button 
                className="px-4 py-2 rounded-full bg-accent text-background text-sm font-semibold"
              >
                View Changelog →
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No repositories with changelogs available.</p>
      )}
    </div>
    </>
  );
};

export default ViewChangelogs;