import type { GetServerSideProps } from "next";

export default function Index() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const destination = "/home";

  ctx.res.setHeader("Location", destination);
  ctx.res.statusCode = 302;
  ctx.res.end();

  return { props: {} };
};
