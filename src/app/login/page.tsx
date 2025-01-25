'use client';

import { signIn } from "next-auth/react";
import HomeButton from "@/app/components/HomeButton";
import BackButton from "@/app/components/BackButton";

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative">
      <BackButton />
      <HomeButton />
      <div className="p-8 rounded-lg bg-surface card-glow text-center space-y-6">
        <h1 className="text-4xl font-bold hover-glow">Welcome to Chainge.</h1>
        <p className="text-gray-400">Login with GitHub to get started</p>
        <button
          onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
          className="px-8 py-4 rounded-full bg-accent text-background font-semibold glow-effect"
        >
          Continue with GitHub →
        </button>
      </div>
    </div>
  );
}
