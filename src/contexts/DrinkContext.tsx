
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

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

export interface DailyGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  unit: string;
  type: 'calories' | 'drinks' | 'sugar' | 'caffeine';
}

interface DrinkContextType {
  scannedDrinks: DrinkData[];
  addDrink: (drink: DrinkData) => void;
  currentDrink: DrinkData | null;
  setCurrentDrink: (drink: DrinkData | null) => void;
  dailyGoals: DailyGoal[];
  updateDailyGoal: (goalId: string, target: number) => void;
  addDailyGoal: (goal: Omit<DailyGoal, 'id' | 'current'>) => void;
  getTodayCalories: () => number;
  getTodayDrinks: () => DrinkData[];
}

const DrinkContext = createContext<DrinkContextType | undefined>(undefined);

export const DrinkProvider = ({ children }: { children: ReactNode }) => {
  const [scannedDrinks, setScannedDrinks] = useState<DrinkData[]>([]);
  const [currentDrink, setCurrentDrink] = useState<DrinkData | null>(null);
  const [dailyGoals, setDailyGoals] = useState<DailyGoal[]>([
    {
      id: '1',
      name: 'Daily Calories',
      target: 2000,
      current: 0,
      unit: 'kcal',
      type: 'calories'
    },
    {
      id: '2',
      name: 'Sugar Limit',
      target: 50,
      current: 0,
      unit: 'g',
      type: 'sugar'
    },
    {
      id: '3',
      name: 'Daily Drinks',
      target: 8,
      current: 0,
      unit: 'drinks',
      type: 'drinks'
    }
  ]);

  const addDrink = (drink: DrinkData) => {
    setScannedDrinks(prev => [drink, ...prev]);
    setCurrentDrink(drink);
    updateGoalProgress();
  };

  const getTodayCalories = () => {
    const today = new Date().toDateString();
    return scannedDrinks
      .filter(drink => drink.timestamp.toDateString() === today)
      .reduce((total, drink) => total + drink.calories, 0);
  };

  const getTodayDrinks = () => {
    const today = new Date().toDateString();
    return scannedDrinks.filter(drink => drink.timestamp.toDateString() === today);
  };

  const updateGoalProgress = () => {
    const todayDrinks = getTodayDrinks();
    const todayCalories = todayDrinks.reduce((total, drink) => total + drink.calories, 0);
    const todaySugar = todayDrinks.reduce((total, drink) => total + drink.sugar, 0);
    
    setDailyGoals(prev => prev.map(goal => ({
      ...goal,
      current: goal.type === 'calories' ? todayCalories : 
               goal.type === 'sugar' ? todaySugar :
               goal.type === 'drinks' ? todayDrinks.length : goal.current
    })));
  };

  const updateDailyGoal = (goalId: string, target: number) => {
    setDailyGoals(prev => prev.map(goal => 
      goal.id === goalId ? { ...goal, target } : goal
    ));
  };

  const addDailyGoal = (newGoal: Omit<DailyGoal, 'id' | 'current'>) => {
    const goal: DailyGoal = {
      ...newGoal,
      id: Date.now().toString(),
      current: 0
    };
    setDailyGoals(prev => [...prev, goal]);
  };

  useEffect(() => {
    updateGoalProgress();
  }, [scannedDrinks]);

  return (
    <DrinkContext.Provider value={{
      scannedDrinks,
      addDrink,
      currentDrink,
      setCurrentDrink,
      dailyGoals,
      updateDailyGoal,
      addDailyGoal,
      getTodayCalories,
      getTodayDrinks
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
