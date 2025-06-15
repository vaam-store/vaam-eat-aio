import { Button } from '@app/components/button';

export default function NotFound() {
  return (
    <html>
      <body className="flex min-h-screen flex-col items-center justify-center">
        <main className="flex w-full max-w-2xl flex-col items-center justify-center gap-4 p-4">
          <h2 className="text-4xl font-bold">Page not found</h2>
          <p className="text-lg">The page you're looking for doesn't exist.</p>
          <div className="flex gap-4">
            <button
              onClick={() => window.location.replace('/')}
              className="btn btn-primary"
              type="button"
            >
              Go home
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}