export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 md:px-6 py-8 text-center">
        <p className="text-sm text-muted-foreground">
          &copy; {currentYear} Analyst's Insight. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
