import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  status: "ok" | "error";
  message?: string;
  data?: any;
};

export default async function logout(
  _: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  return res
    .status(200)
    .setHeader("Set-Cookie", [
      `accessToken=; path=/; httpOnly; SameSite=Strict; Max-Age=0; secure`,
      `refreshToken=; path=/; httpOnly; SameSite=Strict; Max-Age=0; secure`,
    ])
    .json({ status: "ok" });
}
