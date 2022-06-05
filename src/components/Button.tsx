import { useEffect } from "react";
import { KAKAO_APP_KEY_JAVASCRIPT } from "../constant";

export function Button({ type }: { type: "save" | "load" }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        window.Kakao.init(KAKAO_APP_KEY_JAVASCRIPT);
      } catch (e) {
        //
      }
    }
  }, []);

  return (
    <>
      <button
        onClick={() => {
          window.Kakao.Auth.authorize({
            redirectUri: `http://localhost:3000/${type}/data`,
          });
        }}
      >
        {type === "save" ? "저장" : "불러오기"}
      </button>
    </>
  );
}
