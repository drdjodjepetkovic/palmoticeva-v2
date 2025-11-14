
import Image from 'next/image';

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-[101]">
      <div>
        {/* Use a larger version of the logo specifically for the splash screen */}
        <Image
            src="https://firebasestorage.googleapis.com/v0/b/palmoticeva-portal.firebasestorage.app/o/pwa%2Ficon-512x512.png?alt=media"
            alt="Palmotićeva Logo"
            width={128}
            height={128}
            className="rounded-3xl"
            priority
        />
      </div>
    </div>
  );
}
