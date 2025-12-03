'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
            <h2 className="mb-4 text-2xl font-bold">Nešto je pošlo po zlu!</h2>
            <p className="mb-8 text-muted-foreground">
                Došlo je do greške prilikom učitavanja aplikacije.
                <br />
                <span className="text-xs font-mono bg-muted p-1 rounded mt-2 block max-w-md mx-auto overflow-auto">
                    {error.message}
                </span>
            </p>
            <Button onClick={() => reset()}>Pokušaj ponovo</Button>
        </div>
    );
}
