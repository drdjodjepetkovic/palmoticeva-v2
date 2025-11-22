import Image from 'next/image';

export default function Logo() {
  return (
    <Image
      src="/pwa/icon-192x192.png"
      alt="Palmotićeva Logo"
      width={24}
      height={24}
      className="rounded-full"
    />
  );
}
