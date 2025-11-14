import Image from 'next/image';

export default function Logo() {
  return (
    <Image
      src="https://firebasestorage.googleapis.com/v0/b/palmoticeva-portal.firebasestorage.app/o/pwa%2Ficon-192x192.png?alt=media"
      alt="Palmotićeva Logo"
      width={24}
      height={24}
      className="rounded-full"
    />
  );
}
