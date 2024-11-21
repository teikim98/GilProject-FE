'use client';

import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDarkMode } from '@/store/useDarkMode';

export function DarkModeToggle() {
    const { isDarkMode, toggleDarkMode } = useDarkMode();

    return (
        <Button
            variant="ghost"
            onClick={toggleDarkMode}
            className="ml-auto"
        >
            {isDarkMode ? (
                <Sun className="h-7 w-7" />
            ) : (
                <Moon className="h-7 w-7" />
            )}
        </Button>
    );
}