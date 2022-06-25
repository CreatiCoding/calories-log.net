import { Octokit } from "@octokit/rest";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

export interface KakaoToken {
  accessToken?: string;
  refreshToken: string;
}

export async function getKakaoToken({
  code,
  redirectUri,
}: {
  code: string;
  redirectUri: string;
}): Promise<KakaoToken> {
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
}: Pick<KakaoToken, "accessToken">): Promise<KakaoAccount> {
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

export function getTokenFromCookie(cookie?: string): KakaoToken | null {
  const cookies = (cookie || "").split("; ");
  const accessToken = cookies
    .find((cookie) => cookie.startsWith("accessToken="))
    ?.split("=")[1];
  const refreshToken = cookies
    .find((cookie) => cookie.startsWith("refreshToken="))
    ?.split("=")[1];

  if (refreshToken == null) {
    return null;
  }

  return { accessToken, refreshToken };
}

// 여기 수정해야함
export async function getTokenFromKakao(
  host: string,
  code: string
): Promise<KakaoToken> {
  const redirectUri = `${host}/kakao/login`;

  return await getKakaoToken({ code, redirectUri });
}

export async function renewalAccessToken(refreshToken: string) {
  const { KAKAO_REST_API_KEY = "", KAKAO_CLIENT_SECRET = "" } = process.env;

  if (KAKAO_CLIENT_SECRET === "" || KAKAO_REST_API_KEY === "") {
    throw new Error("KAKAO_CLIENT_SECRET or KAKAO_REST_API_KEY is not defined");
  }

  const params = new URLSearchParams();
  params.append("grant_type", "refresh_token");
  params.append("client_id", KAKAO_REST_API_KEY);
  params.append("client_secret", KAKAO_CLIENT_SECRET);
  params.append("refresh_token", refreshToken);

  const { data } = await axios.post(
    "https://kauth.kakao.com/oauth/token",
    params,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    }
  );

  return { accessToken: data.access_token, refreshToken } as KakaoToken;
}

export async function getKakaoEmail(
  cookie?: string
): Promise<{ email: string; token?: KakaoToken }> {
  const token = await getTokenFromCookie(cookie);

  if (token == null) {
    throw new Error("로그인을 먼저 해주세요");
  }

  const refreshToken = token.refreshToken;

  try {
    const { email } = await getKakaoAccount(token);

    return { email };
  } catch (error: any) {
    if (error.response.data.msg === "this access token does not exist") {
      const token = await renewalAccessToken(refreshToken);

      const { email } = await getKakaoAccount(token);

      return { email, token };
    }

    throw error;
  }
}

export function setHeaderToken(token: KakaoToken) {
  if (token.accessToken == null) {
    return [
      "Set-Cookie",
      [
        `refreshToken=${token.refreshToken}; path=/; httpOnly; SameSite=Strict; Max-Age=31536000; secure`,
      ],
    ] as const;
  }

  return [
    "Set-Cookie",
    [
      `accessToken=${token.accessToken}; path=/; httpOnly; SameSite=Strict; Max-Age=31536000; secure`,
      `refreshToken=${token.refreshToken}; path=/; httpOnly; SameSite=Strict; Max-Age=31536000; secure`,
    ],
  ] as const;
}
