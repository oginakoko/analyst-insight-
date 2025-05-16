import Link from 'next/link';
import { MountainIcon } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-card shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <MountainIcon className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold text-foreground">Analyst's Insight</span>
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            prefetch={false}
          >
            Home
          </Link>
          <Link
            href="/admin/posts"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            prefetch={false}
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
