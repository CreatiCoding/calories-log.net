import {
  getKakaoAccount,
  getTokenFromCookie,
  getUserData,
} from "../../../src/api/utils";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  status: "ok" | "error";
  id?: string | null | number;
  email?: string | null;
  message?: string;
  data?: any;
  redirect?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const token = await getTokenFromCookie(req);

    if (token === null) {
      return res.status(403).json({
        status: "error",
        redirect: "/",
        message: "로그인을 먼저 해주세요.",
      });
    }

    const { accessToken } = token;

    const { email } = await getKakaoAccount({ accessToken });

    const data = await getUserData({ email });

    return res.status(200).json({
      status: "ok",
      data,
    });
  } catch (e: any) {
    if (e.response.data.error_code === "KOE403") {
      return res.status(403).json({
        status: "error",
        redirect: "/",
        message: "토큰이 만료되었으므로 다시 로그인해주세요.",
      });
    }

    return res.status(500).json({
      status: "error",
      message: e.message,
      data: e.response.data,
    });
  }
}
