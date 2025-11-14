
"use client";

import * as React from "react";
import { X, Languages, CalendarHeart, Award, ArrowRight, BookOpen, CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/language-context";
import { useEventBus } from "@/context/event-bus-context";
import { UserEventType } from "@/lib/events";
import { usePwaInstall } from "@/hooks/use-pwa-install";

// Helper for positioning the tooltip
const getStepPosition = (step: number): React.CSSProperties => {
  if (typeof window === 'undefined') {
    return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
  }
  
  const isMobile = window.innerWidth < 768;

  switch (step) {
    case 0: // Language switcher
      return { top: '80px', right: isMobile ? '60px' : '150px' };
    case 1: // Smart Calendar
      return { top: '55%', left: '50%', transform: 'translateX(-50%)' };
    case 2: // Bottom Nav
      return { bottom: '80px', left: '50%', transform: 'translateX(-50%)' };
    case 3: // Badges
      return { top: '65%', left: '50%', transform: 'translateX(-50%)' };
    default:
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
  }
};

export default function AppWalkthrough() {
  const [step, setStep] = React.useState(0);
  const [position, setPosition] = React.useState<React.CSSProperties>({});
  const { user, showWalkthrough, setShowWalkthrough } = useAuth();
  const router = useRouter();
  const { language } = useLanguage();
  const { emit } = useEventBus();
  const [isMobile, setIsMobile] = React.useState(false);

  const steps = [
    {
      title: "Izaberite jezik",
      description: "Prilagodite aplikaciju odabirom jezika koji Vam najviše odgovara.",
      icon: Languages,
    },
    {
      title: "Smart Kalendar",
      description: "Saznajte sve o Vašem ciklusu, plodnim danima i analizi ciklusa.",
      icon: CalendarHeart,
    },
    {
      title: "Cenovnik i Zakazivanje",
      description: "Pogledajte cenovnik usluga ili zakažite Vaš pregled sa lakoćom.",
      icon: BookOpen,
    },
    {
      title: "Sakupljajte Bedževe",
      description: "Sakupite sve bedževe i osvojite nagradu za vernost!",
      icon: Award,
    },
  ];
  
  const handleNext = () => {
    let nextStep = step + 1;
    if (nextStep < steps.length) {
      setStep(nextStep);
    } else {
      handleComplete();
    }
  };

  // Recalculate position on step change and window resize
  React.useEffect(() => {
    function updateState() {
        if (typeof window !== 'undefined') {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            setPosition(getStepPosition(step));
        }
    }
    updateState();
    window.addEventListener('resize', updateState);
    return () => window.removeEventListener('resize', updateState);
  }, [step]);


  const handleComplete = async () => {
    setShowWalkthrough(false);
    emit(UserEventType.WalkthroughComplete);
    
    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, { hasCompletedOnboarding: true });
      } catch (error) {
        console.error("Failed to update onboarding status:", error);
      }
    }
  };

  const currentStep = steps[step];
  
  if (!showWalkthrough) {
    return null;
  }
  const Icon = currentStep.icon;

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm animate-in fade-in-50">
      <div
        className="absolute w-72 max-w-[calc(100vw-2rem)] p-4 bg-primary text-primary-foreground rounded-xl shadow-2xl transition-all duration-300 ease-in-out"
        style={position}
      >
        <div className="relative">
            <div className="flex flex-col items-center text-center">
              <div className="flex-shrink-0 bg-primary-foreground/20 p-3 rounded-full mb-3">
                <Icon className="h-8 w-8" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">{currentStep.title}</h3>
                <p className="text-sm opacity-90">{currentStep.description}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex gap-1.5">
                {steps.map((s, index) => (
                  <div
                      key={index}
                      className={cn(
                      "h-2 w-2 rounded-full transition-all",
                      index === step ? "w-4 bg-white" : "bg-white/50"
                      )}
                  />
                ))}
              </div>
              <Button
                onClick={handleNext}
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90"
              >
                {step === steps.length - 1 ? "Započni" : "Dalje"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

             <button onClick={handleComplete} className="absolute -top-6 -right-6 h-8 w-8 bg-white text-primary rounded-full flex items-center justify-center shadow-lg">
                <X className="h-5 w-5" />
             </button>
        </div>
      </div>
    </div>
  );
}
