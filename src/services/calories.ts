import { get, post } from "./api";

function getBaseURL() {
  if (typeof window === "undefined") {
    return "https://calories-log.net/api";
  }

  if (window.location.hostname === "life.creco.me") {
    return "https://life.creco.me/calories/api";
  }

  if (window.location.hostname === "calories-log.net") {
    return "https://calories-log.net/api";
  }

  return "http://localhost:3000/api";
}
export async function updateCalories({ data }: { data: any }) {
  const resopnse = await post(`${getBaseURL()}/calories`, { data });
  return resopnse.data;
}

export async function fetchCalories() {
  const resopnse = await get(`${getBaseURL()}/calories`);
  const { data } = resopnse.data;
  return data;
}
