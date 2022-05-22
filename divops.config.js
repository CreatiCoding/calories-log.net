const { authMiddleware } = require("@divops/auth-middleware");
const { createNotionDBClient } = require("@divops/notion-database");
const { createNotionSystem } = require("@divops/notion-system");
const { createSimpleAuth } = require("@divops/simple-auth");
const { SimpleCache } = require("@divops/simple-cache");
const { createThumbnailsRoute } = require("@divops/thumbnails-route");

const auth = createSimpleAuth({
  masterId: process.env.MASTER_ID,
  masterPassword: process.env.MASTER_PW,
  context: { editUrl: `/post/write`, writable: true },
});

const notionSystem = createNotionSystem({
  notion: createNotionDBClient({
    apiToken: process.env.NOTION_SECRET,
    databaseId: process.env.NOTION_DATABASE,
    verbose: true,
  }),
  cache: new SimpleCache(),
  auth,
});

const thumbnails = createThumbnailsRoute({ host: "creco.me" });

module.exports = {
  customServer: (server) => {
    server.use(authMiddleware("auth", auth.validator));

    server.use("/api/notion", notionSystem);

    server.use("/api/thumbs", thumbnails);

    server.post("/api/login", auth.loginRoute);
  },
};
