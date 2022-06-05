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
        redirectUri: `http://localhost:3000/save/data`,
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
      console.log("load is called");

      window.Kakao.Auth.authorize({
        redirectUri: `http://localhost:3000/load/data`,
      });
    },
  ] as const;
}
