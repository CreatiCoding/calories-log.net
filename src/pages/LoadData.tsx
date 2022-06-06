import * as localStorage from "local-storage";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useCalories } from "../hooks/calories";
import { loadData } from "../services/data";

export default function LoadDataPage() {
  const router = useRouter();
  const [, , update] = useCalories();

  useEffect(() => {
    const code = router.query.code;

    if (code == null || typeof code !== "string") {
      return;
    }

    (async () => {
      if (localStorage.get("kakao-email") != null) {
        const email = localStorage.get("kakao-email") as string;
        const { data } = await loadData({ email });

        if (data == null) {
          return;
        }

        update(data);
        router.push("/");
        return;
      }

      const { email, data } = await loadData({ code });

      if (email == null || data == null) {
        return;
      }

      if (email != null) {
        localStorage.set("kakao-email", email);
      }

      update(data);
      router.push("/");
    })();
  }, [router, update]);

  return null;
}
