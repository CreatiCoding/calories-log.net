import * as localStorage from "local-storage";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { loginKakao } from "../services/user";

export default function KakaoLoginPage() {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    const code = router.query.code;

    if (code == null || typeof code !== "string") {
      alert("인가 코드가 없습니다. 재로그인 부탁해요 🙏");
      router.push("/");
      return;
    }

    (async () => {
      const { email } = await loginKakao({ code });

      localStorage.set("kakao-email", email);

      router.push("/");
    })();
  }, [router]);

  return null;
}
