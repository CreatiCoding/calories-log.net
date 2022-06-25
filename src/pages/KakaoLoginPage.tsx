import { useRouter } from "next/router";
import { useEffect } from "react";
import { loginKakao } from "../services/user";

function path(path: string) {
  if (typeof window === "undefined") {
    return path;
  }

  if (window.location.hostname === "life.creco.me") {
    return `/calories${path}`;
  }

  if (window.location.hostname === "calories-log.net") {
    return path;
  }

  return path;
}

export default function KakaoLoginPage() {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    const code = router.query.code;

    if (code == null || typeof code !== "string") {
      alert("인가 코드가 없습니다. 재로그인 부탁해요 🙏");
      router.push(path("/"));
      return;
    }

    (async () => {
      const { data } = await loginKakao({ code });
      if (data.email != null) {
        router.push(path(`/?email=${data.email}`));
        return;
      }

      router.push(path("/"));
    })();
  }, [router]);

  return null;
}
