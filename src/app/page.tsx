'use client';
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [position, setPosition] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isPaused) {
      const timer = setInterval(() => {
        setPosition(prev => (prev - 1) % (features.length * 500));
      }, 30);

      return () => clearInterval(timer);
    }
  }, [isPaused]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden pb-32">
      <main className="max-w-6xl w-full mt-48">
        <div className="text-center space-y-12">
          <h1 className="text-7xl font-bold tracking-tight hover-glow">
            AI-Powered Changelogs
            <span className="text-accent">.</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Generate beautiful changelogs from your Git commits automatically. 
            Because the only thing more annoying than Reading Documentation of Writing it.
          </p>
          <div className="pt-8">
          <div className="space-x-6">
            <Link
              href="/view-changelogs"
              className="inline-block px-8 py-4 rounded-full bg-accent text-background font-semibold glow-effect"
            >
              View Changelogs →
            </Link>
            <Link
              href="/login"
              className="inline-block px-8 py-4 rounded-full bg-accent text-background font-semibold glow-effect"
            >
              Create Changelogs →
            </Link>
          </div>
          </div>
        </div>

        <div className="relative h-[400px] mt-16">
          <div className="absolute w-full carousel-track">
            <div 
              className="flex gap-8 absolute"
              style={{
                transform: `translateX(${position}px)`,
                transition: isPaused ? 'transform 0.3s ease-out' : 'none'
              }}
            >
              {[...features, ...features, ...features].map((feature, i) => (
                <div
                  key={i}
                  className="carousel-card"
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                >
                  <div className="p-8 rounded-lg bg-surface card-glow h-full text-center"> {/* Added text-center here */}
                    <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                    <p className="text-gray-400 text-lg">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const features = [
  {
    title: "AI-Powered",
    description: "Intelligent summarization of your Git commits into human-readable changelogs"
  },
  {
    title: "GitHub Integration",
    description: "Connect your GitHub repositories with a single click"
  },
  {
    title: "Beautiful Output",
    description: "Generate professionally formatted changelogs that your users will love"
  }
];
