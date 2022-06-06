import { post } from "./api";

export async function loginKakao({ code }: { code: string }) {
  return await post("/api/kakao/login", { code });
}

export async function logoutKakao() {
  return await post("/api/kakao/logout");
}
