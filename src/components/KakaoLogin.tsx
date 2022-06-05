import { useEffect } from "react";
import { KAKAO_APP_KEY_JAVASCRIPT } from "../constant";

declare global {
  interface Window {
    Kakao: any;
  }
}

export function KakaoLogin() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.Kakao.init(KAKAO_APP_KEY_JAVASCRIPT);
    }
  }, []);
  return (
    <>
      <a
        id="custom-login-btn"
        href="#"
        onClick={() => {
          window.Kakao.Auth.authorize({
            redirectUri: "http://localhost:3000/kakao/login",
          });
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="//k.kakaocdn.net/14/dn/btroDszwNrM/I6efHub1SN5KCJqLm1Ovx1/o.jpg"
          width="222"
          alt="카카오 로그인 버튼"
        />
      </a>
    </>
  );
}
