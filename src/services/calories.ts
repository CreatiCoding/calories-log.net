import { get, post } from "./api";

export async function updateCalories({ data }: { data: any }) {
  const resopnse = await post("/api/calories", { data });
  return resopnse.data;
}

export async function fetchCalories() {
  const resopnse = await get("/api/calories");
  const { data } = resopnse.data;
  return data;
}
