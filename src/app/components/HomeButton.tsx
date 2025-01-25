'use client';

import Link from 'next/link';

const HomeButton = () => {
  return (
    <div className="absolute top-6 right-6 z-50">
      <Link href="/" className="px-4 py-2 rounded-full bg-accent text-background font-semibold">
        Home
      </Link>
    </div>
  );
};

export default HomeButton;
