import { PiggyBank } from 'lucide-react';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2">
      <PiggyBank className="h-6 w-6 text-primary" />
      <span className="text-xl font-bold tracking-tight">FinTrack</span>
    </Link>
  );
}
