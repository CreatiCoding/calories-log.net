import {
  getKakaoEmail,
  getUserData,
  setHeaderToken,
  setUserData,
} from "../../src/api/utils";
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
    switch (req.method) {
      case "GET": {
        const { token, data } = await fetchCalories(req.headers);

        if (token == null) {
          return res.status(200).json({ status: "ok", data });
        }

        return res
          .status(200)
          .setHeader(setHeaderToken(token)[0], setHeaderToken(token)[1])
          .json({ status: "ok", data });
      }

      case "POST": {
        const { token } = await updateCalories({
          cookie: req.headers.cookie,
          data: req.body.data,
        });

        if (token == null) {
          return res.status(200).json({ status: "ok" });
        }

        return res
          .status(200)
          .setHeader(setHeaderToken(token)[0], setHeaderToken(token)[1])
          .json({ status: "ok" });
      }

      default: {
        return res.status(200).json({
          status: "error",
          message: `HTTP Method 가 잘못되었습니다. (${req.method})`,
        });
      }
    }
  } catch (e: any) {
    if (
      e.message === "로그인을 먼저 해주세요" ||
      e.response?.data?.error_code === "KOE322" ||
      e.response?.data?.error_code === "KOE403" ||
      e.response?.data?.msg === "this access token does not exist" ||
      e.response?.data?.msg === "this access token is already expired"
    ) {
      return res.status(403).json({
        status: "error",
        redirect: "/login",
        message: [
          `토큰이 만료되었으므로 다시 로그인해주세요.`,
          ...(e.message != null ? [`message: ${e.message}`] : []),
          ...(e.response?.data?.error_code != null
            ? [`error_code: ${e.response?.data?.error_code}`]
            : []),
          ...(e.response?.data?.msg != null
            ? [`msg: ${e.response?.data?.msg}`]
            : []),
        ].join("\n"),
      });
    }

    return res.status(500).json({
      status: "error",
      message: `${e.message} ${JSON.stringify(e.response.data)}`,
      data: e.response.data,
    });
  }
}

async function fetchCalories({ cookie }: { cookie?: string }) {
  const { email, token } = await getKakaoEmail(cookie);

  const data = await getUserData({ email });

  return { token, data } as const;
}

async function updateCalories({
  cookie,
  data,
}: {
  cookie?: string;
  data: any;
}) {
  const { email, token } = await getKakaoEmail(cookie);

  await setUserData({ email, data });

  return { token } as const;
}
