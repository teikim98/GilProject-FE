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
            className="ml-auto px-2  hover:bg-purple-100 dark:hover:bg-purple-600/40 transition-colors"
        >
            {isDarkMode ? (
                <Sun className="h-7 w-7 text-purple-900 dark:text-purple-100" />
            ) : (
                <Moon className="h-7 w-7 text-purple-900 dark:text-purple-100" />
            )}
        </Button>
    );
}