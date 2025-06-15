import { Button } from '@app/components/button';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <html>
      <body className="flex min-h-screen flex-col items-center justify-center">
        <main className="flex w-full max-w-2xl flex-col items-center justify-center gap-4 p-4">
          <h2 className="text-4xl font-bold">Something went wrong!</h2>
          <p className="text-lg">{error.message}</p>
          <div className="flex gap-4">
            <button
              onClick={() => reset()}
              className="btn btn-primary"
              type="button"
            >
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}