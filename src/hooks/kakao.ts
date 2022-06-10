import * as localStorage from "local-storage";
import { useRouter } from "next/router";
import { KAKAO_APP_KEY_JAVASCRIPT } from "../constant";
import { loadData, saveData } from "../services/data";
import { logoutKakao } from "../services/user";
import { useCalories } from "./calories";

declare global {
  interface Window {
    Kakao: any;
  }
}

export function useKakao() {
  const router = useRouter();
  const [calories, , update] = useCalories();

  return [
    async () => {
      try {
        const { status, redirect, message } = await saveData({
          data: calories,
        });

        if (status !== "ok") {
          alert(message);
          router.push(redirect);
          return;
        }

        router.reload();
      } catch (error: any) {
        console.log(error.message);
        console.log(error.response.data);
      }
    },
    async () => {
      try {
        const { status, redirect, message, data } = await loadData();

        if (status !== "ok") {
          alert(message);
          router.push(redirect);
          return;
        }

        if (data == null) {
          alert("data 가 비어있습니다.");
          router.push(redirect);
          return;
        }

        update(data);
        router.reload();
      } catch (error: any) {
        console.log(error.message);
        console.log(error.response.data);
      }
    },
    () => {
      if (typeof window !== "undefined") {
        if (!window.Kakao.isInitialized()) {
          window.Kakao.init(KAKAO_APP_KEY_JAVASCRIPT);
        }
      }

      window.Kakao.Auth.authorize({
        redirectUri: `${process.env.NEXT_PUBLIC_HOSTNAME}/kakao/login`,
        scope: "account_email",
        throughTalk: false,
      });
    },

    async () => {
      await logoutKakao();

      localStorage.remove("kakao-email");

      router.reload();
    },
  ] as const;
}
