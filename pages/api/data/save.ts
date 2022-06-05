import { getKakaoId, setUserData } from "../../../src/api/utils";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  id?: string | null;
  message?: string;
  data?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const id = (await getKakaoId(
      req.body.code,
      `${process.env.NEXT_PUBLIC_HOSTNAME}/save/data`
    )) as string;

    await setUserData({ id, data: req.body.data });

    return res.status(200).json({ id });
  } catch (e: any) {
    if (e.response.data.error_code === "KOE320") {
      return res.status(200).json({
        id: null,
        data: e.response.data,
      });
    }

    return res.status(500).json({
      message: e.message,
      data: e.response.data,
    });
  }
}
