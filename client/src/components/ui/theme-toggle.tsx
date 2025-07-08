import { Moon, Sun } from 'lucide-react';
import { Button } from './button';
import { useTheme } from '@/contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
      ) : (
        <Sun className="h-5 w-5 text-slate-500 dark:text-slate-400" />
      )}
    </Button>
  );
}
