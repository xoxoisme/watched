export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{
          backgroundImage:
            "url(https://image.tmdb.org/t/p/original/oaGvjB0DvdhXSOa9CBNgYAQ4kvc.jpg)"
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-black" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="px-4 py-5 md:px-12">
          <a href="/" className="font-brand text-3xl tracking-widest text-accent">
            WATCHED
          </a>
        </header>

        <main className="flex flex-1 items-start justify-center px-4 py-8 md:py-16">
          {children}
        </main>

        <footer className="px-4 py-6 text-center text-xs text-white/40">
          © 2026 Watched. Archive what you've watched.
        </footer>
      </div>
    </div>
  );
}
