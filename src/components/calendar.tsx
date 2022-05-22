import { css } from "@emotion/react";
import { useState } from "react";
import { getDateLengthOfMonth, MM } from "../computed/date";
import Arrow from "./arrow";

interface CalendarProps {
  year: number;
  month: number;
}

export function Calendar(props: CalendarProps) {
  const [year, setYear] = useState(props.year);
  const [month, setMonth] = useState(props.month);
  const date = getDateLengthOfMonth(year, month);

  if (isNaN(date.monthLength) || month < 1 || month > 12) {
    return (
      <div>
        <h1>Calendar</h1>
        <p
          css={css`
            color: red;
          `}
        >
          Invalid year: {year}
          <br />
          Invalid month: {month}
          <br />
          {JSON.stringify(date, null, 2)}
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
        {new Array(date.start.getDay() + date.monthLength)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              css={css`
                padding: 0 10px;
                border: 1px solid #c8c8c8;
                text-align: center;
              `}
            >
              {i >= date.start.getDay() ? i - date.start.getDay() + 1 : ""}
            </div>
          ))}
      </div>
    </div>
  );
}
