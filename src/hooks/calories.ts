import * as localStorage from "local-storage";
import { useState } from "react";

function updateCalories(calories: any) {
  return localStorage.set("calories", JSON.stringify(calories));
}

function fetchCalories(): Record<string, number> {
  if (localStorage.get("calories")) {
    const json = decodeURIComponent(localStorage.get("calories") as string);
    return JSON.parse(json);
  }

  return {};
}

export type Calories = Record<string, number>;

export function useCalories() {
  const [calories, setCalories] = useState<Record<string, number>>(
    fetchCalories()
  );

  const addCalories = (date: string, calory: number) => {
    if (calories[date]) {
      calories[date] += calory;
    } else {
      calories[date] = calory;
    }

    setCalories(calories);
    updateCalories(calories);

    location.reload();
  };

  return [calories, addCalories] as const;
}
