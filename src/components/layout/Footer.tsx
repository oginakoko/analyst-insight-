
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            &copy; {currentYear} Analyst's Insight. All rights reserved.
          </p>
          <nav className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2">
            <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Contact
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
