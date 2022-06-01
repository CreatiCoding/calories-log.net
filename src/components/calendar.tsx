import { css } from "@emotion/react";
import * as localStorage from "local-storage";
import { useEffect, useState } from "react";
import { getDateLengthOfMonth, MM } from "../computed/date";
import Arrow from "./arrow";
import Label from "./label";

interface CalendarProps {
  year: number;
  month: number;
}

function updateCalories(calories: any) {
  return localStorage.set("calories", JSON.stringify(calories));
}

function fetchCalories(): Record<string, number> {
  if (localStorage.get("calories")) {
    const json = decodeURIComponent(localStorage.get("calories") as string);
    return JSON.parse(json);
  }

  return {};
}

function useCalories() {
  const [calories, setCalories] = useState<Record<string, number>>(
    fetchCalories()
  );

  const addCalories = (date: string, calory: number) => {
    if (calories[date]) {
      calories[date] += calory;
    } else {
      calories[date] = calory;
    }

    setCalories(calories);
    updateCalories(calories);

    location.reload();
  };

  return [calories, addCalories] as const;
}

export function Calendar(props: CalendarProps) {
  const [list, setList] = useState<number[]>([]);
  const [year, setYear] = useState(props.year);
  const [month, setMonth] = useState(props.month);
  const [calories, addCalories] = useCalories();
  const [sum, setSum] = useState(0);
  const [length, setLength] = useState(0);
  const date = getDateLengthOfMonth(year, month);

  useEffect(() => {
    const list = new Array(date.start.getDay() + date.monthLength)
      .fill(0)
      .map((_, i) => i - date.start.getDay() + 1);

    setList(list);

    // FIXME: 고쳐주세요, date를 안쪽으로 밀던지 해야함
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month]);

  useEffect(() => {
    setSum(Object.values(calories).reduce((acc, cur) => acc + cur, 0));
    setLength(Object.values(calories).filter((e) => e !== 0).length);
  }, [calories]);

  if (isNaN(date.monthLength) || month < 1 || month > 12) {
    return (
      <div>
        <p
          css={css`
            color: red;
          `}
        >
          Invalid year: {year}
          <br />
          Invalid month: {month}
          <br />
        </p>
      </div>
    );
  }

  return (
    <div>
      <div>
        <Label name={"total"} value={sum} />{" "}
        <Label
          name={"avg"}
          value={isNaN(sum / length) ? 0 : (sum / length).toFixed(2)}
        />
      </div>
      <div
        css={css`
          display: grid;
          grid-template-columns: 30% 40% 30%;
          align-items: center;
          text-align: center;
          margin-top: 10px;
        `}
      >
        <Arrow.Left
          onClick={() => {
            const next = month - 1;

            if (next > 12) {
              setYear(year + 1);
              setMonth(next - 12);
              return;
            }

            if (next < 1) {
              setYear(year - 1);
              setMonth(next + 12);
              return;
            }

            setMonth(next);
          }}
        />

        <h3>
          {year} / {MM(month)}
        </h3>

        <Arrow.Right
          onClick={() => {
            const next = month + 1;

            if (next > 12) {
              setYear(year + 1);
              setMonth(next - 12);
              return;
            }

            if (next < 1) {
              setYear(year - 1);
              setMonth(next + 12);
              return;
            }

            setMonth(next);
          }}
        />
      </div>

      <div
        css={css`
          margin-top: 20px;
          display: grid;
          grid-gap: 0;
          gap: 10px 20px;
          row-gap: 10px;
          column-gap: 2px;
          grid-template-columns: repeat(auto-fill, minmax(12.5%, auto));
          grid-template-rows: repeat(6, 50px);
        `}
      >
        {list.length > 0 &&
          list.map((day, i) => (
            <div
              key={i}
              css={css`
                padding: 0 5px;
                border: 1px solid #c8c8c8;
                text-align: center;
              `}
              onClick={() => {
                const calory = prompt(`추가할 칼로리를 입력하세요.`);

                if (calory) {
                  addCalories(`${year}-${MM(month)}-${day}`, Number(calory));
                }
              }}
            >
              {i >= date.start.getDay() && (
                <p
                  css={css`
                    font-size: 12px;
                  `}
                >
                  {day}
                </p>
              )}

              {calories?.[`${year}-${MM(month)}-${day}`] ? (
                <p
                  css={css`
                    background-color: purple;
                    color: white;
                    font-size: 14px;
                    padding: 5px 0;
                    font-weight: bold;
                  `}
                >
                  {calories?.[`${year}-${MM(month)}-${day}`]}
                </p>
              ) : (
                <p></p>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
