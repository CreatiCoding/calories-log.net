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

      const hostname =
        `https://${window.location.hostname}` ??
        process.env.NEXT_PUBLIC_HOSTNAME ??
        "https://calories-log.net";

      console.log({ hostname });

      window.Kakao.Auth.authorize({
        redirectUri: `${hostname}/kakao/login`,
        scope: "account_email",
        throughTalk: false,
      });
    },
  ] as const;
}
