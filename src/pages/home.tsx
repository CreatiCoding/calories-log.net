import Page from "@divops/component-page";
import { css } from "@emotion/react";
import Header from "next/head";
import { useEffect, useState } from "react";
import { Calendar } from "../components/calendar";
import Label from "../components/label";
import { MM } from "../computed/date";
import { useCalories } from "../hooks/calories";
import { pageStyle } from "../styles/page";

export default function HomePage() {
  const [now, setNow] = useState<Date | null>(null);
  const [calories, addCalories] = useCalories();
  const [accSum, setAccSum] = useState(0);
  const [accLength, setAccLength] = useState(0);
  const [monthlySum, setMonthlySum] = useState(0);
  const [monthlyLength, setMonthlyLength] = useState(0);

  useEffect(() => {
    setAccSum(Object.values(calories).reduce((acc, cur) => acc + cur, 0));
    setAccLength(Object.values(calories).filter((e) => e !== 0).length);

    if (now != null) {
      setMonthlySum(
        Object.entries(calories)
          .filter(([e]) => e.split("-")[1] === MM(now.getMonth() + 1))
          .reduce((acc, [_, cur]) => acc + cur, 0)
      );
      setMonthlyLength(
        Object.entries(calories)
          .filter(([e]) => e.split("-")[1] === MM(now.getMonth() + 1))
          .filter(([_, e]) => e !== 0).length
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
          padding: 2rem 0 1rem 0;
        }
      `}
      header={Header}
    >
      <div
        css={css`
          width: 300px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 20% 40% 40%;
          align-items: center;
          text-align: center;
          margin-top: 10px;
        `}
      >
        <Label name={"누적"} />
        <Label name={"total"} value={accSum} />{" "}
        <Label
          name={"avg"}
          value={
            isNaN(accSum / accLength) ? 0 : (accSum / accLength).toFixed(2)
          }
        />
        <Label name={"이번달"} />
        <Label name={"total"} value={monthlySum} />{" "}
        <Label
          name={"avg"}
          value={
            isNaN(monthlySum / monthlyLength)
              ? 0
              : (monthlySum / monthlyLength).toFixed(2)
          }
        />
      </div>
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
        values={Object.entries(calories)
          .filter((x) => x[1] !== 0)
          .reduce((a, x) => ({ ...a, [x[0]]: `${x[1]}` }), {})}
        onClickDate={({ year, month, date }) => {
          const calory = prompt(`추가할 칼로리를 입력하세요.`);

          if (calory) {
            addCalories(`${year}-${MM(month)}-${date}`, Number(calory));
          }
        }}
        onChangeCurrent={(_, next) => {
          setNow(new Date(next.year, next.month - 1, next.date));
        }}
      />
    </Page>
  );
}
