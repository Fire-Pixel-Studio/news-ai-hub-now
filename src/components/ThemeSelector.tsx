
import { useState } from 'react';
import { Palette, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme, Theme } from '@/contexts/ThemeContext';

const themes: { value: Theme; label: string; preview: string }[] = [
  { value: 'light', label: 'Light', preview: 'bg-white border-gray-200' },
  { value: 'dark', label: 'Dark', preview: 'bg-gray-900 border-gray-700' },
  { value: 'light-fancy', label: 'Light Fancy', preview: 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200' },
  { value: 'dark-fancy', label: 'Dark Fancy', preview: 'bg-gradient-to-r from-purple-900 to-blue-900 border-purple-700' },
  { value: 'light-modern', label: 'Light Modern', preview: 'bg-gray-50 border-gray-300' },
  { value: 'dark-modern', label: 'Dark Modern', preview: 'bg-gray-800 border-gray-600' },
  { value: 'blue', label: 'Ocean Blue', preview: 'bg-gradient-to-r from-blue-500 to-blue-600 border-blue-400' },
  { value: 'purple', label: 'Royal Purple', preview: 'bg-gradient-to-r from-purple-500 to-purple-600 border-purple-400' },
  { value: 'green', label: 'Forest Green', preview: 'bg-gradient-to-r from-green-500 to-green-600 border-green-400' },
];

const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Palette className="w-4 h-4" />
          Theme
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-background border z-50">
        {themes.map((themeOption) => (
          <DropdownMenuItem
            key={themeOption.value}
            onClick={() => setTheme(themeOption.value)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded border ${themeOption.preview}`} />
              <span>{themeOption.label}</span>
            </div>
            {theme === themeOption.value && <Check className="w-4 h-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSelector;
