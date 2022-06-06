import * as localStorage from "local-storage";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useCalories } from "../hooks/calories";
import { saveData } from "../services/data";

export default function SaveDataPage() {
  const router = useRouter();
  const [calories] = useCalories();

  useEffect(() => {
    const { code } = router.query;

    if (code == null || typeof code !== "string") {
      return;
    }

    (async () => {
      const { email } = await saveData({ code, data: calories });

      if (email != null) {
        localStorage.set("kakao-email", email);
      }

      router.push("/");
    })();
  }, [router, calories]);

  return null;
}
