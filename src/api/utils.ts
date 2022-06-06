import { Octokit } from "@octokit/rest";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

export async function getKakaoToken({
  code,
  redirectUri,
}: {
  code: string;
  redirectUri: string;
}): Promise<{ accessToken: string; refreshToken: string }> {
  const { KAKAO_REST_API_KEY = "", KAKAO_CLIENT_SECRET = "" } = process.env;

  if (KAKAO_CLIENT_SECRET === "" || KAKAO_REST_API_KEY === "") {
    throw new Error("KAKAO_CLIENT_SECRET or KAKAO_REST_API_KEY is not defined");
  }

  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("client_id", KAKAO_REST_API_KEY);
  params.append("redirect_uri", redirectUri);
  params.append("client_secret", KAKAO_CLIENT_SECRET);
  params.append("code", code);

  const { data } = await axios.post(
    "https://kauth.kakao.com/oauth/token",
    params,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
  };
}

interface KakaoAccount {
  id: number;
  has_email: boolean;
  email_needs_agreement: boolean;
  is_email_valid: boolean;
  is_email_verified: boolean;
  email: string;
}

export async function getKakaoAccount({
  accessToken,
}: {
  accessToken: string;
}): Promise<KakaoAccount> {
  const {
    data: { id, kakao_account },
  } = await axios.get("https://kapi.kakao.com/v2/user/me", {
    params: {
      property_keys: ["kakao_account.email"],
    },
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return {
    ...kakao_account,
    id,
  };
}

export async function setUserData({
  email,
  data,
}: {
  email: string;
  data: any;
}) {
  const octokit = new Octokit({
    auth: `token ${process.env.GITHUB_TOKEN}`,
  });

  const sha = await (async () => {
    try {
      const {
        data: { sha },
      } = (await octokit.rest.repos.getContent({
        owner: "creaticoding",
        repo: "calories-log.net-storage",
        path: "users/" + email + ".json",
      })) as { data: { sha: string } };

      return sha;
    } catch {
      return undefined;
    }
  })();

  await octokit.rest.repos.createOrUpdateFileContents({
    owner: "creaticoding",
    repo: "calories-log.net-storage",
    path: "users/" + email + ".json",
    message: "update user(" + email + ")",
    sha,
    content: Buffer.from(JSON.stringify(data)).toString("base64"),
  });
}

export async function getUserData({ email }: { email: string }) {
  const octokit = new Octokit({
    auth: `token ${process.env.GITHUB_TOKEN}`,
  });

  const { data } = (await octokit.rest.repos.getContent({
    owner: "creaticoding",
    repo: "calories-log.net-storage",
    path: "users/" + email + ".json",
  })) as { data: { content: string } };

  return JSON.parse(Buffer.from(data.content, "base64").toString());
}

export function getTokenFromCookie(req: NextApiRequest): {
  accessToken: string;
  refreshToken: string;
} | null {
  const cookies = (req.headers.cookie || "").split("; ");
  const accessToken = cookies
    .find((cookie) => cookie.startsWith("accessToken="))
    ?.split("=")[1];
  const refreshToken = cookies
    .find((cookie) => cookie.startsWith("refreshToken="))
    ?.split("=")[1];

  if (accessToken == null || refreshToken == null) {
    return null;
  }

  return { accessToken, refreshToken };
}

export async function getTokenFromKakao(
  code: string
): Promise<{ accessToken: string; refreshToken: string }> {
  const redirectUri = `${process.env.NEXT_PUBLIC_HOSTNAME}/kakao/login`;

  return await getKakaoToken({ code, redirectUri });
}

export async function getToken(req: NextApiRequest) {
  return getTokenFromCookie(req) ?? (await getTokenFromKakao(req.body.code));
}
