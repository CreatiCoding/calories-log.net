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
      await saveData({ code, data: calories });
      router.push("/");
    })();
  }, [router, calories]);

  return null;
}
