"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeSwitcher() {
    const { setTheme, theme } = useTheme();

    return (
        <div className="flex items-center gap-2">
            <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme("light")}
                className="gap-2"
            >
                <Sun className="h-4 w-4" />
                Light
            </Button>
            <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme("dark")}
                className="gap-2"
            >
                <Moon className="h-4 w-4" />
                Dark
            </Button>
            <Button
                variant={theme === 'system' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme("system")}
                className="gap-2"
            >
                <Monitor className="h-4 w-4" />
                System
            </Button>
        </div>
    );
}

export default ThemeSwitcher;
