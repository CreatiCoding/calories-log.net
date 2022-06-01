import { css } from "@emotion/react";
import { Dispatch, SetStateAction } from "react";
import { getDateLengthOfMonth, getOneMonthDays, MM } from "../computed/date";
import { Calories } from "../hooks/calories";
import Arrow from "./arrow";

interface CalendarProps {
  year: number | undefined;
  month: number | undefined;
  calories: Calories;
  addCalories: ({
    year,
    month,
    day,
  }: {
    year: number;
    month: number;
    day: number;
  }) => void;
  setYear: Dispatch<SetStateAction<number | undefined>>;
  setMonth: Dispatch<SetStateAction<number>>;
}

export function Calendar(props: CalendarProps) {
  const { calories, addCalories, year, month, setYear, setMonth } = props;
  if (year == null || month == null) {
    return null;
  }

  const date = getDateLengthOfMonth(year, month);
  const list = getOneMonthDays(date);

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
              onClick={() => addCalories({ year, month, day })}
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
                ""
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
