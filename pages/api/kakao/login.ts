import { getKakaoAccount, getTokenFromKakao } from "../../../src/api/utils";
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
    const { accessToken, refreshToken } = await getTokenFromKakao(
      req.body.code
    );

    const { email } = await getKakaoAccount({ accessToken });
    return res
      .status(200)
      .setHeader("Set-Cookie", [
        `accessToken=${accessToken}; path=/; httpOnly; SameSite=Strict; Max-Age=31536000; secure`,
        `refreshToken=${refreshToken}; path=/; httpOnly; SameSite=Strict; Max-Age=31536000; secure`,
      ])
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
