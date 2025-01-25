'use client';

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BackButton from "@/app/components/BackButton";

interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    if (session?.accessToken) {
      fetch('https://api.github.com/user/repos', {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          setRepos(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching repos:', error);
          setLoading(false);
        });
    }
  }, [session, status, router]);

  const filteredRepos = repos.filter(repo =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-accent">Loading repositories...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 relative">
      <BackButton />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Your Repositories</h1>
        
        <input
          type="text"
          placeholder="Search repositories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-6 p-2 border border-gray-300 rounded w-full text-black"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRepos.map((repo) => (
            <div
              key={repo.id}
              className="p-6 rounded-lg bg-surface card-glow cursor-pointer transition-transform transform hover:scale-105"
              onClick={() => router.push(`/dashboard/${repo.full_name}`)}
            >
              <h3 className="text-xl font-semibold mb-2 hover-glow">{repo.name}</h3>
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
      </div>
    </div>
  );
}
