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
        try {
          window.Kakao.init(KAKAO_APP_KEY_JAVASCRIPT);
        } catch (e) {
          //
        }
      }
      console.log("save is called");

      window.Kakao.Auth.authorize({
        redirectUri: `${process.env.NEXT_PUBLIC_HOSTNAME}/save/data`,
      });
    },
    () => {
      if (typeof window !== "undefined") {
        try {
          window.Kakao.init(KAKAO_APP_KEY_JAVASCRIPT);
        } catch (e) {
          //
        }
      }
      console.log("load is called", process.env.NEXT_PUBLIC_HOSTNAME);

      window.Kakao.Auth.authorize({
        redirectUri: `${process.env.NEXT_PUBLIC_HOSTNAME}/load/data`,
      });
    },
  ] as const;
}
