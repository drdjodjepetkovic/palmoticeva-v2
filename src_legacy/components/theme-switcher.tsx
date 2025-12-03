"use client"

import * as React from "react"
import { Apple, Code, Flower, Gem, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type Theme = "theme-default" | "theme-matrix" | "theme-flower" | "theme-lux" | "theme-apple";

const themes: { name: Theme, label: string, icon: React.ElementType }[] = [
    { name: "theme-default", label: "Default", icon: Sun },
    { name: "theme-flower", label: "Flower", icon: Flower },
    { name: "theme-apple", label: "Apple", icon: Apple },
    { name: "theme-lux", label: "Lux", icon: Gem },
    { name: "theme-matrix", label: "Matrix", icon: Code },
];

export default function ThemeSwitcher() {
  const { user, userProfile } = useAuth();
  const [currentTheme, setCurrentTheme] = React.useState<Theme>("theme-default");

  React.useEffect(() => {
    const savedTheme = userProfile?.preferredTheme || localStorage.getItem("app-theme") || "theme-default";
    const theme = savedTheme as Theme;
    
    setCurrentTheme(theme);
    const bodyClass = document.body.className;
    if (!bodyClass.includes(theme)) {
        document.body.className = cn(bodyClass.replace(/theme-\w+/g, ''), theme);
    }
  }, [userProfile]);

  const setTheme = async (newTheme: Theme) => {
    setCurrentTheme(newTheme);
    localStorage.setItem("app-theme", newTheme);
    const bodyClass = document.body.className;
    document.body.className = cn(bodyClass.replace(/theme-\w+/g, ''), newTheme);

    if (user) {
        try {
            const userDocRef = doc(db, 'users', user.uid);
            await updateDoc(userDocRef, { preferredTheme: newTheme });
        } catch (error) {
            console.error("Failed to save theme preference:", error);
        }
    }
  };

  return (
    <TooltipProvider>
        <div className="flex flex-wrap gap-2">
            {themes.map((theme) => {
                const Icon = theme.icon;
                return (
                     <Tooltip key={theme.name}>
                        <TooltipTrigger asChild>
                            <Button 
                                variant={currentTheme === theme.name ? "default" : "outline"} 
                                size="icon" 
                                onClick={() => setTheme(theme.name)}
                            >
                                <Icon className="h-4 w-4" />
                                <span className="sr-only">{theme.label}</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{theme.label}</p>
                        </TooltipContent>
                    </Tooltip>
                )
            })}
        </div>
    </TooltipProvider>
  )
}
