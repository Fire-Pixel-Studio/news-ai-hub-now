
import { useState } from 'react';
import { Palette, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { useTheme, Theme } from '@/contexts/ThemeContext';

const themeGroups = [
  {
    label: 'Classic',
    themes: [
      { value: 'light' as Theme, label: 'Light', preview: 'bg-white border-gray-200' },
      { value: 'dark' as Theme, label: 'Dark', preview: 'bg-gray-900 border-gray-700' },
    ]
  },
  {
    label: 'Fancy',
    themes: [
      { value: 'light-fancy' as Theme, label: 'Light Fancy', preview: 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200' },
      { value: 'dark-fancy' as Theme, label: 'Dark Fancy', preview: 'bg-gradient-to-r from-purple-900 to-blue-900 border-purple-700' },
    ]
  },
  {
    label: 'Modern',
    themes: [
      { value: 'light-modern' as Theme, label: 'Light Modern', preview: 'bg-gray-50 border-gray-300' },
      { value: 'dark-modern' as Theme, label: 'Dark Modern', preview: 'bg-gray-800 border-gray-600' },
    ]
  },
  {
    label: 'Ocean',
    themes: [
      { value: 'ocean' as Theme, label: 'Ocean Light', preview: 'bg-gradient-to-r from-cyan-400 to-blue-500 border-cyan-300' },
      { value: 'dark-ocean' as Theme, label: 'Ocean Dark', preview: 'bg-gradient-to-r from-slate-900 to-blue-900 border-slate-700' },
    ]
  },
  {
    label: 'Sunset',
    themes: [
      { value: 'sunset' as Theme, label: 'Sunset Light', preview: 'bg-gradient-to-r from-orange-400 to-pink-500 border-orange-300' },
      { value: 'dark-sunset' as Theme, label: 'Sunset Dark', preview: 'bg-gradient-to-r from-gray-900 to-purple-900 border-orange-700' },
    ]
  },
  {
    label: 'Forest',
    themes: [
      { value: 'forest' as Theme, label: 'Forest Light', preview: 'bg-gradient-to-r from-green-400 to-emerald-500 border-green-300' },
      { value: 'dark-forest' as Theme, label: 'Forest Dark', preview: 'bg-gradient-to-r from-gray-900 to-green-900 border-green-700' },
    ]
  },
  {
    label: 'Legacy',
    themes: [
      { value: 'blue' as Theme, label: 'Blue', preview: 'bg-gradient-to-r from-blue-500 to-blue-600 border-blue-400' },
      { value: 'purple' as Theme, label: 'Purple', preview: 'bg-gradient-to-r from-purple-500 to-purple-600 border-purple-400' },
      { value: 'green' as Theme, label: 'Green', preview: 'bg-gradient-to-r from-green-500 to-green-600 border-green-400' },
    ]
  }
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
      <DropdownMenuContent align="end" className="w-56 bg-background border z-50 max-h-96 overflow-y-auto">
        {themeGroups.map((group, groupIndex) => (
          <div key={group.label}>
            <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider">
              {group.label}
            </DropdownMenuLabel>
            {group.themes.map((themeOption) => (
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
            {groupIndex < themeGroups.length - 1 && <DropdownMenuSeparator />}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSelector;
