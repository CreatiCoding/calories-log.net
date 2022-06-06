import { post } from "./api";

export async function saveData({ data }: { data: any }) {
  return await post("/api/data/save", { data });
}

export async function loadData() {
  return await post("/api/data/load");
}
