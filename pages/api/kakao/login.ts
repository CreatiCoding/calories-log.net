import {
  getKakaoAccount,
  getTokenFromKakao,
  setHeaderToken,
} from "../../../src/api/utils";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  status: "ok" | "error";
  email?: string;
  message?: string;
  data?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const token = await getTokenFromKakao(req.body.code);

    const { email } = await getKakaoAccount(token);
    return res
      .status(200)
      .setHeader(setHeaderToken(token)[0], setHeaderToken(token)[1])
      .json({ status: "ok", email });
  } catch (e: any) {
    if (e.response.data.error_code === "KOE320") {
      return res.status(200).json({ status: "ok" });
    }

    return res.status(500).json({
      status: "error",
      message: e.message,
      data: e.response.data,
    });
  }
}
