
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface DrinkData {
  id: string;
  name: string;
  calories: number;
  sugar: number;
  caffeine?: number;
  image?: string;
  timestamp: Date;
  healthInsight?: string;
  alternative?: string;
}

interface DrinkContextType {
  scannedDrinks: DrinkData[];
  addDrink: (drink: DrinkData) => void;
  currentDrink: DrinkData | null;
  setCurrentDrink: (drink: DrinkData | null) => void;
}

const DrinkContext = createContext<DrinkContextType | undefined>(undefined);

export const DrinkProvider = ({ children }: { children: ReactNode }) => {
  const [scannedDrinks, setScannedDrinks] = useState<DrinkData[]>([]);
  const [currentDrink, setCurrentDrink] = useState<DrinkData | null>(null);

  const addDrink = (drink: DrinkData) => {
    setScannedDrinks(prev => [drink, ...prev]);
    setCurrentDrink(drink);
  };

  return (
    <DrinkContext.Provider value={{
      scannedDrinks,
      addDrink,
      currentDrink,
      setCurrentDrink
    }}>
      {children}
    </DrinkContext.Provider>
  );
};

export const useDrink = () => {
  const context = useContext(DrinkContext);
  if (context === undefined) {
    throw new Error('useDrink must be used within a DrinkProvider');
  }
  return context;
};
