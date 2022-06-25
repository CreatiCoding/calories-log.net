import { post } from "./api";

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

export async function loginKakao({ code }: { code: string }) {
  return await post(`${getBaseURL()}/kakao/login`, { code });
}
