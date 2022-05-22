import Page from "@divops/component-page";
import Header from "next/head";
import { Calendar } from "../components/calendar";
import { pageStyle } from "../styles/page";

export default function HomePage() {
  const now = new Date();

  return (
    <Page title={"내 칼로리"} css={pageStyle} header={Header}>
      <Calendar year={now.getFullYear()} month={now.getMonth() + 1} />
    </Page>
  );
}
