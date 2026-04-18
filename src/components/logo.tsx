import Image from 'next/image';

// 2026-04-18 — AI assistant avatar: Palmotićeva brand monogram (logolondon.webp).
// Ista marka kao u headeru — dosledan brand. Zamenjuje prethodni rainbow gradient PWA icon.
// Korišćeno SAMO u src/components/ai/ai-assistant.tsx.
export default function Logo() {
  return (
    <Image
      src="/logolondon.webp"
      alt="Palmotićeva"
      width={24}
      height={24}
      className="rounded-md shrink-0 object-cover"
    />
  );
}
