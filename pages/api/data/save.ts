import {
  getKakaoEmail,
  setHeaderToken,
  setUserData,
} from "../../../src/api/utils";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  status: "ok" | "error";
  id?: string | number | null;
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
    const { email, token } = await getKakaoEmail(req.headers.cookie);

    await setUserData({ email, data: req.body.data });

    if (token == null) {
      return res.status(200).json({ status: "ok" });
    }

    return res
      .status(200)
      .setHeader(setHeaderToken(token)[0], setHeaderToken(token)[1])
      .json({ status: "ok" });
  } catch (e: any) {
    if (
      e.message === "로그인을 먼저 해주세요" ||
      e.response.data.error_code === "KOE403" ||
      e.response.data.msg === "this access token does not exist"
    ) {
      return res.status(403).json({
        status: "error",
        redirect: "/",
        message: `토큰이 만료되었으므로 다시 로그인해주세요. ${JSON.stringify({
          message: e.message,
          error_code: e.response?.data?.error_code,
          msg: e.response?.data?.msg,
        })}`,
      });
    }

    return res.status(500).json({
      status: "error",
      message: `${e.message} ${JSON.stringify(e.response.data)}`,
      data: e.response.data,
    });
  }
}
