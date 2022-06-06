import * as localStorage from "local-storage";
import { useRouter } from "next/router";
import { KAKAO_APP_KEY_JAVASCRIPT } from "../constant";

declare global {
  interface Window {
    Kakao: any;
  }
}

export function useKakao() {
  const router = useRouter();
  return [
    () => {
      if (typeof window !== "undefined") {
        if (!window.Kakao.isInitialized()) {
          window.Kakao.init(KAKAO_APP_KEY_JAVASCRIPT);
        }
      }

      window.Kakao.Auth.authorize({
        redirectUri: `${process.env.NEXT_PUBLIC_HOSTNAME}/save/data`,
        scope: "account_email",
      });
    },
    () => {
      if (typeof window !== "undefined") {
        if (!window.Kakao.isInitialized()) {
          window.Kakao.init(KAKAO_APP_KEY_JAVASCRIPT);
        }
      }

      if (localStorage.get("kakao-email")) {
        router.push("/load/data");
        return;
      }

      window.Kakao.Auth.authorize({
        redirectUri: `${process.env.NEXT_PUBLIC_HOSTNAME}/load/data`,
        scope: "account_email",
      });
    },
  ] as const;
}
