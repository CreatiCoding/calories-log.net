// import * as localStorage from "local-storage";
import { useRouter } from "next/router";
import { useState } from "react";
import { QueryClient, useQuery } from "react-query";
import { fetchCalories, updateCalories } from "../services/calories";

export type Calories = Record<string, number>;

export interface CaloriesResponse {
  isLoading: false;
  data: Record<string, number>;
  add: (date: string, calory: number) => Promise<void>;
  remove: (date: string) => Promise<void>;
}

export interface CaloriesLoading {
  isLoading: true;
}

export interface CaloriesError {
  isLoading: boolean;
  error: { message: string };
}

export function useCalories():
  | CaloriesLoading
  | CaloriesResponse
  | CaloriesError {
  const router = useRouter();
  const [version, setVersion] = useState<number>(Date.now());

  const {
    data = {},
    isLoading,
    error,
  } = useQuery<Record<string, number>, CaloriesError["error"]>(
    ["fetchCalories", version],
    fetchCalories,
    {
      retry: 0,
    }
  );

  if (error != null) {
    try {
      if (error?.["message"] != null) {
        const { message, redirect } = JSON.parse(error.message);

        console.log(message);

        router.push(redirect);

        return { isLoading, error };
      }
    } catch (e) {
      console.log(error.message);

      return { isLoading, error };
    }

    return { isLoading, error };
  }

  if (isLoading) {
    return { isLoading };
  }

  const update = async (data: Record<string, number>) => {
    await updateCalories({ data });
    const queryClient = new QueryClient();
    await queryClient.invalidateQueries(["fetchCalories"]);
    setVersion(Date.now());
  };

  const add = async (date: string, calory: number) => {
    const copied = { ...data };
    if (copied[date]) {
      copied[date] += calory;
    } else {
      copied[date] = calory;
    }

    await update(copied);
  };

  const remove = async (date: string) => {
    const copied = { ...data };
    delete copied[date];

    await update(copied);
  };

  return {
    isLoading,
    data,
    add,
    remove,
  };
}
