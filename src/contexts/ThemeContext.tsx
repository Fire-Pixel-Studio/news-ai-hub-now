
import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'light' | 'dark' | 'light-fancy' | 'dark-fancy' | 'light-modern' | 'dark-modern' | 'blue' | 'purple' | 'green' | 'ocean' | 'dark-ocean' | 'sunset' | 'dark-sunset' | 'forest' | 'dark-forest' | 'day-sky' | 'night-sky' | 'solar-system' | 'galaxy' | 'rainbow' | 'dark-rainbow' | 'afternoon' | 'dark-afternoon' | 'rainy' | 'dark-rainy' | 'stormy' | 'dark-stormy' | 'neon-city' | 'dark-neon-city' | 'autumn' | 'dark-autumn' | 'winter' | 'dark-winter' | 'volcanic' | 'dark-volcanic' | 'cyberpunk' | 'dark-cyberpunk' | 'tropical' | 'dark-tropical';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    return savedTheme || 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    
    // Remove all theme classes from both html and body
    const classList = ['light', 'dark', 'light-fancy', 'dark-fancy', 'light-modern', 'dark-modern', 'blue', 'purple', 'green', 'ocean', 'dark-ocean', 'sunset', 'dark-sunset', 'forest', 'dark-forest', 'day-sky', 'night-sky', 'solar-system', 'galaxy', 'rainbow', 'dark-rainbow', 'afternoon', 'dark-afternoon', 'rainy', 'dark-rainy', 'stormy', 'dark-stormy', 'neon-city', 'dark-neon-city', 'autumn', 'dark-autumn', 'winter', 'dark-winter', 'volcanic', 'dark-volcanic', 'cyberpunk', 'dark-cyberpunk', 'tropical', 'dark-tropical'];
    classList.forEach(cls => {
      document.documentElement.classList.remove(cls);
      document.body.classList.remove(cls);
    });
    
    // Add current theme class to both html and body
    document.documentElement.classList.add(theme);
    document.body.classList.add(theme);
    
    // Set the data-theme attribute for better CSS targeting
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
