import { KAKAO_APP_KEY_JAVASCRIPT } from "../constant";

declare global {
  interface Window {
    Kakao: any;
  }
}

export function useKakao() {
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

      window.Kakao.Auth.authorize({
        redirectUri: `${process.env.NEXT_PUBLIC_HOSTNAME}/load/data`,
        scope: "account_email",
      });
    },
  ] as const;
}
