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

  const update = (data: Record<string, number>) => {
    setCalories(data);
    updateCalories(data);
  };

  const addCalories = (date: string, calory: number) => {
    if (calories[date]) {
      calories[date] += calory;
    } else {
      calories[date] = calory;
    }

    update(calories);

    location.reload();
  };

  const removeCalories = (date: string) => {
    calories[date] = 0;

    update(calories);

    location.reload();
  };

  return [
    calories,
    {
      add: addCalories,
      remove: removeCalories,
    },
    update,
  ] as const;
}
