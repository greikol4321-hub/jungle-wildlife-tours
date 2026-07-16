import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <h1
        className="font-heading font-bold text-text"
        style={{ fontSize: 'clamp(4rem, 10vw, 8rem)' }}
      >
        404
      </h1>
      <p className="mt-3 text-lg text-text-secondary">
        No encontramos la página que buscabas.
      </p>
      <Link
        href="/"
        className="btn btn-primary mt-8 inline-flex items-center gap-2"
      >
        Volver al inicio
      </Link>
    </main>
  );
}
