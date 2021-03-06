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
      title={"?????? ?????? ?????????"}
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
        keywords={[`???????????????\n${email?.split("@")[0]}???`]}
        onClick={(keyword: string) => {
          switch (keyword) {
            case `???????????????\n${email?.split("@")[0]}???`: {
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
          { value: "??????" },
          { value: "total" },
          { value: accSum, useLoading: calories.isLoading },
          { value: "avg" },
          {
            value: isNaN(accSum / accLength)
              ? 0
              : (accSum / accLength).toFixed(2),
            useLoading: calories.isLoading,
          },
          { value: "?????????" },
          { value: "total" },
          { value: monthlySum, useLoading: calories.isLoading },
          { value: "avg" },
          {
            value: isNaN(monthlySum / monthlyLength)
              ? 0
              : (monthlySum / monthlyLength).toFixed(2),
            useLoading: calories.isLoading,
          },
        ]}
      />
      <Calendar
        current={{
          year: now.getFullYear(),
          month: now.getMonth() + 1,
          date: now.getDate(),
        }}
        loading={calories.isLoading}
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
          keywords={["????????? ??????", "?????? ??????"]}
          onClick={async (keyword: string, [year, month, date]: any[]) => {
            if (calories.isLoading) {
              alert("?????? ???????????? ???????????????.");
              return;
            }
            if ((calories as CaloriesError).error != null) {
              return;
            }

            const { add, remove } = calories as CaloriesResponse;

            switch (keyword) {
              case "????????? ??????": {
                const calory = prompt(`????????? ???????????? ???????????????.`);

                if (calory) {
                  await add(`${year}-${MM(month)}-${date}`, Number(calory));
                }
                return;
              }
              case "?????? ??????": {
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
            {email}???, ??????????????? ?????????????
          </p>
        )}
      </>
    </Page>
  );
}
