import { KAKAO_APP_KEY_JAVASCRIPT } from "../constant";

declare global {
  interface Window {
    Kakao: any;
  }
}

function getBaseURL() {
  if (typeof window === "undefined") {
    return "https://calories-log.net";
  }

  if (window.location.hostname === "life.creco.me") {
    return "https://life.creco.me/calories";
  }

  if (window.location.hostname === "calories-log.net") {
    return "https://calories-log.net";
  }

  return "http://localhost:3000";
}

export function useKakao() {
  return [
    () => {
      if (typeof window !== "undefined") {
        if (!window.Kakao.isInitialized()) {
          window.Kakao.init(KAKAO_APP_KEY_JAVASCRIPT);
        }
      }

      console.log({ hostname: getBaseURL() });

      window.Kakao.Auth.authorize({
        redirectUri: `${getBaseURL()}/kakao/login`,
        scope: "account_email",
        throughTalk: false,
      });
    },
  ] as const;
}
