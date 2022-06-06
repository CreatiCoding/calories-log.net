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
      const { email, data } = await loadData({ code });

      if (email == null || data == null) {
        return;
      }

      if (email != null) {
        localStorage.setItem("kakao-email", email);
      }

      update(data);
      router.push("/");
    })();
  }, [router, update]);

  return null;
}
