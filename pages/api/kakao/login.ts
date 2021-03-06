import {
  getKakaoAccount,
  getTokenFromKakao,
  setHeaderToken,
} from "../../../src/api/utils";
import type { NextApiRequest, NextApiResponse } from "next";

function getBaseURL(hostname?: string) {
  if (typeof hostname === "undefined") {
    return "https://calories-log.net";
  }

  if (hostname === "https://life.creco.me") {
    return "https://life.creco.me/calories";
  }

  if (hostname === "https://calories-log.net") {
    return "https://calories-log.net";
  }

  return "http://localhost:3000";
}

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
    const hostname = getBaseURL(req.headers.origin);

    const token = await getTokenFromKakao(hostname, req.body.code);

    const { email } = await getKakaoAccount(token);
    return res
      .status(200)
      .setHeader(setHeaderToken(token)[0], setHeaderToken(token)[1])
      .json({ status: "ok", email, data: { hostname } });
  } catch (e: any) {
    if (e.response?.data?.error_code === "KOE320") {
      return res.status(200).json({ status: "ok" });
    }

    e.response.data.host =
      `${req.headers.origin}/calories` ??
      process.env.NEXT_PUBLIC_HOSTNAME ??
      "https://calories-log.net";

    return res.status(500).json({
      status: "error",
      message: e.message,
      data: e.response.data,
    });
  }
}
