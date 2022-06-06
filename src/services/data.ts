import { post } from "./api";

export async function saveData({ code, data }: { code: string; data: any }) {
  return await post("/api/data/save", { code, data });
}

export async function loadData({
  code,
  email,
}: {
  code?: string;
  email?: string;
}) {
  return await post("/api/data/load", { code, email });
}
