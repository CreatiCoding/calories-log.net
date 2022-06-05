import { css } from "@emotion/react";
import { getDateLengthOfMonth, getOneMonthDays, MM } from "../computed/date";
import Arrow from "./arrow";

type CalendarMode = "monthly";
interface CalendarDate {
  year: number;
  month: number;
  date?: number;
}

interface CalendarProps {
  children?: React.ReactNode | undefined;
  mode: CalendarMode;
  today: CalendarDate;
  current: CalendarDate;
  values: Record<string, string>;
  onClickDate: (date: CalendarDate) => void;
  onChangeCurrent: (current: CalendarDate, next: CalendarDate) => void;
}

export function Calendar(props: CalendarProps) {
  const { current, values, children } = props;
  const { year, month } = current;
  const date = getDateLengthOfMonth(year, month);
  const list = getOneMonthDays(date);

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
            props.onChangeCurrent(props.current, {
              ...current,
              month: current.month - 1,
            });
          }}
        />

        <h3>
          {year} / {MM(month)}
        </h3>

        <Arrow.Right
          onClick={() => {
            props.onChangeCurrent(props.current, {
              ...current,
              month: current.month + 1,
            });
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
              onClick={() => props.onClickDate({ year, month, date: day })}
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
              {values?.[`${year}-${MM(month)}-${day}`] ? (
                <p
                  css={css`
                    background-color: purple;
                    color: white;
                    font-size: 14px;
                    padding: 5px 0;
                    font-weight: bold;
                  `}
                >
                  {values?.[`${year}-${MM(month)}-${day}`]}
                </p>
              ) : (
                ""
              )}
            </div>
          ))}
      </div>
      {children != null && children}
    </div>
  );
}
