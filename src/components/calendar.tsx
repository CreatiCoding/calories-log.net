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
  loading?: boolean;
}

export function Calendar(props: CalendarProps) {
  const { current, values, children, loading = false } = props;
  const { year, month } = current;
  const date = getDateLengthOfMonth(year, month);
  const list = getOneMonthDays(date);

  return (
    <div>
      <div
        css={css`
          display: grid;
          grid-template-columns: 35% 30% 35%;
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

        <h3>{`${year} / ${MM(month)}`}</h3>

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
          grid-template-columns: repeat(7, 13.7856%);
          grid-template-rows: repeat(6, 50px);
          gap: 0.58333%;
        `}
      >
        {list.length > 0 &&
          list.map((day, i) => (
            <button
              key={i}
              css={css`
                padding: 0;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: flex-start;
                background-color: unset;
                border: ${day > 0 ? `1px solid #c8c8c8` : "0"};
                ${day <= 0 ? "pointer-events: none;" : ""}
                border-radius: 8px;
                color: black;
                overflow: hidden;

                ${day > 0 && loading
                  ? css`
                      background-color: "#cecece";
                      color: rgba(0, 0, 0, 0);
                      border: unset;
                      background: linear-gradient(
                        ${300 + i * 1.5}deg,
                        #c8c8c8,
                        #f0f0f0
                      );
                      background-size: 400% 400%;

                      -webkit-animation: AnimationName 1s ease infinite;
                      -moz-animation: AnimationName 1s ease infinite;
                      -o-animation: AnimationName 1s ease infinite;
                      animation: AnimationName 1s ease infinite;

                      @-webkit-keyframes AnimationName {
                        0% {
                          background-position: 43% 0%;
                        }
                        50% {
                          background-position: 58% 100%;
                        }
                        100% {
                          background-position: 43% 0%;
                        }
                      }
                      @-moz-keyframes AnimationName {
                        0% {
                          background-position: 43% 0%;
                        }
                        50% {
                          background-position: 58% 100%;
                        }
                        100% {
                          background-position: 43% 0%;
                        }
                      }
                      @-o-keyframes AnimationName {
                        0% {
                          background-position: 43% 0%;
                        }
                        50% {
                          background-position: 58% 100%;
                        }
                        100% {
                          background-position: 43% 0%;
                        }
                      }
                      @keyframes AnimationName {
                        0% {
                          background-position: 43% 0%;
                        }
                        50% {
                          background-position: 58% 100%;
                        }
                        100% {
                          background-position: 43% 0%;
                        }
                      }
                    `
                  : css``}
              `}
              onClick={
                day <= 0
                  ? () => {}
                  : () => props.onClickDate({ year, month, date: day })
              }
            >
              {i >= date.start.getDay() && (
                <span
                  css={css`
                    font-size: 14px;
                    width: 100%;
                    height: 100%;
                    line-height: 22px;
                  `}
                >
                  {day}
                </span>
              )}
              {values?.[`${year}-${MM(month)}-${day}`] ? (
                <span
                  css={css`
                    background-color: ${values?.[`${year}-${MM(month)}-${day}`]
                      ? "purple"
                      : "unset"};
                    color: white;
                    font-size: 14px;
                    font-weight: bold;
                    width: 100%;
                    height: 100%;
                    line-height: 22px;
                  `}
                >
                  {values?.[`${year}-${MM(month)}-${day}`]}
                </span>
              ) : (
                ""
              )}
            </button>
          ))}
      </div>
      {children != null && children}
    </div>
  );
}
