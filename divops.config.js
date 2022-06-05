const { Octokit } = require("@octokit/rest");
const axios = require("axios");

module.exports = {
  customServer: (server) => {
    server.post("/api/data/save", async (req, res) => {
      const id = await getKakaoId(
        req.body.code,
        "http://localhost:3000/save/data"
      );

      await setUserData({ id, data: req.body.data });

      return res.status(200).json({ id });
    });

    server.post("/api/data/load", async (req, res) => {
      const id = await getKakaoId(
        req.body.code,
        "http://localhost:3000/load/data"
      );

      return res.status(200).json({
        id,
        data: await getUserData({ id }),
      });
    });
  },
};

async function getKakaoId(code, redirect_uri) {
  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("client_id", process.env.KAKAO_REST_API_KEY);
  params.append("redirect_uri", redirect_uri);
  params.append("client_secret", process.env.KAKAO_CLIENT_SECRET);
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

  const {
    data: { id },
  } = await axios.get("https://kapi.kakao.com/v2/user/me", {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      Authorization: `Bearer ${data.access_token}`,
    },
  });

  return id;
}

async function setUserData({ id, data }) {
  const octokit = new Octokit({
    auth: `token ${process.env.GITHUB_TOKEN}`,
  });

  const sha = await (async () => {
    try {
      const {
        data: { sha },
      } = await octokit.rest.repos.getContent({
        owner: "creaticoding",
        repo: "calories-log.net-storage",
        path: "users/" + id + ".json",
      });
      return sha;
    } catch {
      return null;
    }
  })();

  await octokit.rest.repos.createOrUpdateFileContents({
    owner: "creaticoding",
    repo: "calories-log.net-storage",
    path: "users/" + id + ".json",
    message: "update user(" + id + ")",
    sha,
    content: Buffer.from(JSON.stringify(data)).toString("base64"),
  });
}

async function getUserData({ id }) {
  const octokit = new Octokit({
    auth: `token ${process.env.GITHUB_TOKEN}`,
  });

  const { data } = await octokit.rest.repos.getContent({
    owner: "creaticoding",
    repo: "calories-log.net-storage",
    path: "users/" + id + ".json",
  });

  return JSON.parse(Buffer.from(data.content, "base64").toString());
}
