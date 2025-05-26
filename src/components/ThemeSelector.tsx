
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
    label: 'Sky & Weather',
    themes: [
      { value: 'day-sky' as Theme, label: 'Day Sky', preview: 'bg-gradient-to-r from-blue-400 to-cyan-300 border-blue-300' },
      { value: 'night-sky' as Theme, label: 'Night Sky', preview: 'bg-gradient-to-r from-indigo-900 to-purple-900 border-indigo-700' },
      { value: 'afternoon' as Theme, label: 'Afternoon', preview: 'bg-gradient-to-r from-yellow-300 to-orange-400 border-yellow-300' },
      { value: 'dark-afternoon' as Theme, label: 'Dark Afternoon', preview: 'bg-gradient-to-r from-orange-900 to-red-900 border-orange-700' },
      { value: 'rainy' as Theme, label: 'Rainy', preview: 'bg-gradient-to-r from-gray-400 to-blue-500 border-gray-400' },
      { value: 'dark-rainy' as Theme, label: 'Dark Rainy', preview: 'bg-gradient-to-r from-gray-800 to-blue-900 border-gray-700' },
      { value: 'stormy' as Theme, label: 'Stormy', preview: 'bg-gradient-to-r from-gray-600 to-slate-700 border-gray-500' },
      { value: 'dark-stormy' as Theme, label: 'Dark Stormy', preview: 'bg-gradient-to-r from-slate-900 to-gray-900 border-slate-800' },
    ]
  },
  {
    label: 'Space & Cosmic',
    themes: [
      { value: 'solar-system' as Theme, label: 'Solar System', preview: 'bg-gradient-to-r from-yellow-500 to-red-600 border-yellow-400' },
      { value: 'galaxy' as Theme, label: 'Galaxy', preview: 'bg-gradient-to-r from-purple-600 to-pink-600 border-purple-500' },
    ]
  },
  {
    label: 'Nature',
    themes: [
      { value: 'ocean' as Theme, label: 'Ocean Light', preview: 'bg-gradient-to-r from-cyan-400 to-blue-500 border-cyan-300' },
      { value: 'dark-ocean' as Theme, label: 'Ocean Dark', preview: 'bg-gradient-to-r from-slate-900 to-blue-900 border-slate-700' },
      { value: 'sunset' as Theme, label: 'Sunset Light', preview: 'bg-gradient-to-r from-orange-400 to-pink-500 border-orange-300' },
      { value: 'dark-sunset' as Theme, label: 'Sunset Dark', preview: 'bg-gradient-to-r from-gray-900 to-purple-900 border-orange-700' },
      { value: 'forest' as Theme, label: 'Forest Light', preview: 'bg-gradient-to-r from-green-400 to-emerald-500 border-green-300' },
      { value: 'dark-forest' as Theme, label: 'Forest Dark', preview: 'bg-gradient-to-r from-gray-900 to-green-900 border-green-700' },
      { value: 'tropical' as Theme, label: 'Tropical', preview: 'bg-gradient-to-r from-lime-400 to-emerald-500 border-lime-300' },
      { value: 'dark-tropical' as Theme, label: 'Dark Tropical', preview: 'bg-gradient-to-r from-emerald-900 to-teal-900 border-emerald-700' },
    ]
  },
  {
    label: 'Seasons',
    themes: [
      { value: 'autumn' as Theme, label: 'Autumn', preview: 'bg-gradient-to-r from-orange-600 to-red-600 border-orange-400' },
      { value: 'dark-autumn' as Theme, label: 'Dark Autumn', preview: 'bg-gradient-to-r from-orange-900 to-red-900 border-orange-700' },
      { value: 'winter' as Theme, label: 'Winter', preview: 'bg-gradient-to-r from-blue-200 to-cyan-200 border-blue-300' },
      { value: 'dark-winter' as Theme, label: 'Dark Winter', preview: 'bg-gradient-to-r from-slate-800 to-blue-900 border-slate-600' },
    ]
  },
  {
    label: 'Futuristic',
    themes: [
      { value: 'neon-city' as Theme, label: 'Neon City', preview: 'bg-gradient-to-r from-pink-400 to-cyan-400 border-pink-300' },
      { value: 'dark-neon-city' as Theme, label: 'Dark Neon City', preview: 'bg-gradient-to-r from-pink-900 to-cyan-900 border-pink-700' },
      { value: 'cyberpunk' as Theme, label: 'Cyberpunk', preview: 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-400' },
      { value: 'dark-cyberpunk' as Theme, label: 'Dark Cyberpunk', preview: 'bg-gradient-to-r from-purple-900 to-pink-900 border-purple-700' },
    ]
  },
  {
    label: 'Volcanic',
    themes: [
      { value: 'volcanic' as Theme, label: 'Volcanic', preview: 'bg-gradient-to-r from-red-600 to-orange-600 border-red-400' },
      { value: 'dark-volcanic' as Theme, label: 'Dark Volcanic', preview: 'bg-gradient-to-r from-red-900 to-yellow-900 border-red-700' },
    ]
  },
  {
    label: 'Colorful',
    themes: [
      { value: 'rainbow' as Theme, label: 'Rainbow', preview: 'bg-gradient-to-r from-red-400 via-yellow-400 to-blue-400 border-red-300' },
      { value: 'dark-rainbow' as Theme, label: 'Dark Rainbow', preview: 'bg-gradient-to-r from-red-900 via-purple-900 to-blue-900 border-red-700' },
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
