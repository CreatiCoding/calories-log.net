import { getKakaoAccount, getUserData } from "../../../src/api/utils";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  id?: string | null | number;
  email?: string | null;
  message?: string;
  data?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const email = await (async () => {
      if (req.body.email == null) {
        const { email } = await getKakaoAccount(
          req.body.code,
          `${process.env.NEXT_PUBLIC_HOSTNAME}/load/data`
        );
        return email;
      } else {
        return req.body.email;
      }
    })();

    return res.status(200).json({
      email,
      data: await getUserData({ email }),
    });
  } catch (e: any) {
    if (e.response.data.error_code === "KOE320") {
      return res.status(200).json({
        id: null,
      });
    }

    return res.status(500).json({
      message: e.message,
      data: e.response.data,
    });
  }
}
