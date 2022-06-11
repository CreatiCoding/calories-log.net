import Page from "@divops/component-page";
import { css } from "@emotion/react";
import Header from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Calendar } from "../components/calendar";
import { Dashboard } from "../components/Dashboard";
// import { HambergerMenu } from "../components/HambergerMenu";
import { MM } from "../computed/date";
import {
  useCalories,
  CaloriesError,
  CaloriesResponse,
} from "../hooks/calories";
import { useDialog } from "../hooks/dialog";
import { pageStyle } from "../styles/page";

export default function IndexPage() {
  const [now, setNow] = useState<Date | null>(null);
  const calories = useCalories();
  const [accSum, setAccSum] = useState(0);
  const [accLength, setAccLength] = useState(0);
  const [monthlySum, setMonthlySum] = useState(0);
  const [monthlyLength, setMonthlyLength] = useState(0);
  const [Dialog, open] = useDialog();
  // const [MenuDialog, openMenu] = useDialog();
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (router.isReady) {
      const { email } = router.query;
      if (email != null) {
        if (typeof email === "string") {
          setEmail(email);
        }
      }
    }
  }, [router]);

  useEffect(() => {
    if (calories.isLoading) {
      return;
    }

    if ((calories as unknown as CaloriesError).error != null) {
      return;
    }

    const { data } = calories as CaloriesResponse;

    setAccSum(Object.values(data).reduce((acc, cur) => acc + cur, 0));
    setAccLength(Object.values(data).filter((e) => e !== 0).length);

    if (now != null) {
      setMonthlySum(
        Object.entries(data)
          .filter(([e]) => e.split("-")[1] === MM(now.getMonth() + 1))
          .reduce((acc, [, cur]) => acc + cur, 0)
      );
      setMonthlyLength(
        Object.entries(data)
          .filter(([e]) => e.split("-")[1] === MM(now.getMonth() + 1))
          .filter(([, e]) => e !== 0).length
      );
    }
  }, [calories, now]);

  useEffect(() => {
    setNow(new Date());
  }, []);

  if (now == null) {
    return null;
  }

  return (
    <Page
      title={"내가 태운 칼로리"}
      css={css`
        ${pageStyle}
        text-align: center;
        div > h1 {
          padding: 1rem 0 1rem 0;
          font-size: 1.5em;
          line-height: 2rem;
        }
      `}
      header={Header}
    >
      {/* <MenuDialog
        keywords={[`안녕하세요\n${email?.split("@")[0]}님`]}
        onClick={(keyword: string) => {
          switch (keyword) {
            case `안녕하세요\n${email?.split("@")[0]}님`: {
              return;
            }
          }
        }}
      />
      <HambergerMenu
        css={css`
          display: inline-block;
          margin: 0;
          position: absolute;
          top: 0;
          right: 0;
          transform: translate(-15px, 17px);
        `}
        onClick={() => openMenu()}
      /> */}
      <Dashboard
        css={css`
          padding: 0 20px;
          width: 100%;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 17% 13% 31% 13% 26%;
          align-items: center;
          text-align: center;
          margin-top: 10px;
        `}
        labels={[
          "누적",
          "total",
          accSum,
          "avg",
          isNaN(accSum / accLength) ? 0 : (accSum / accLength).toFixed(2),
          "이번달",
          "total",
          monthlySum,
          "avg",
          isNaN(monthlySum / monthlyLength)
            ? 0
            : (monthlySum / monthlyLength).toFixed(2),
        ]}
      />
      <Calendar
        current={{
          year: now.getFullYear(),
          month: now.getMonth() + 1,
          date: now.getDate(),
        }}
        mode={"monthly"}
        today={{
          year: now.getFullYear(),
          month: now.getMonth() + 1,
          date: now.getDate(),
        }}
        values={
          calories.isLoading
            ? {}
            : (calories as CaloriesResponse)?.data == null
            ? {}
            : Object.entries((calories as CaloriesResponse)?.data)
                .filter((x) => x[1] !== 0)
                .reduce((a, x) => ({ ...a, [x[0]]: `${x[1]}` }), {})
        }
        onClickDate={({ year, month, date }) => {
          open(year, month, date);
        }}
        onChangeCurrent={(_, next) => {
          setNow(new Date(next.year, next.month - 1, next.date));
        }}
      >
        <Dialog
          keywords={["칼로리 추가", "기록 제거"]}
          onClick={async (keyword: string, [year, month, date]: any[]) => {
            if (calories.isLoading) {
              alert("아직 준비되지 않았습니다.");
              return;
            }
            if ((calories as CaloriesError).error != null) {
              return;
            }

            const { add, remove } = calories as CaloriesResponse;

            switch (keyword) {
              case "칼로리 추가": {
                const calory = prompt(`추가할 칼로리를 입력하세요.`);

                if (calory) {
                  await add(`${year}-${MM(month)}-${date}`, Number(calory));
                }
                return;
              }
              case "기록 제거": {
                await remove(`${year}-${MM(month)}-${date}`);
              }
            }
          }}
        />
      </Calendar>
      <>
        {email && (
          <p
            css={css`
              padding: 0 20px;
              text-align: right;
              font-size: 10px;
            `}
          >
            {email}님, 환영합니다 🙇‍♂️
          </p>
        )}
      </>
    </Page>
  );
}
