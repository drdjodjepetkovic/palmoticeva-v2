export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center p-6">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <h2 className="text-2xl font-semibold mt-4 mb-2">Stranica Nije Pronađena</h2>
      <p className="text-muted-foreground">Žao nam je, ali stranica koju ste tražili ne postoji.</p>
    </div>
  );
}
