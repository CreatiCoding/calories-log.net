import { css } from "@emotion/react";

interface LabelProps {
  value?: string | number;
  bold?: boolean;
  size?: "big" | "small";
  red?: boolean;
  loading?: boolean;
}

export function Label({
  value,
  bold = false,
  size,
  red = false,
  loading = false,
}: LabelProps) {
  if (loading) {
    return (
      <div
        css={css`
          span {
            /* font-size: 1.4rem; */
            line-height: 100%;
          }
          background-color: gray;
          width: 80%;
          margin: 2px auto;
          color: rgba(0, 0, 0, 0);

          background-color: "#cecece";
          color: rgba(0, 0, 0, 0);
          border: unset;
          background: linear-gradient(${300 + 40}deg, #c8c8c8, #f0f0f0);
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
        `}
      >
        <span>loading</span>
      </div>
    );
  }
  return (
    <div
      css={css`
        span {
          ${bold ? `font-weight: bold;` : ``}
          ${size === "big" ? `font-size: 1.4rem;` : ``}
          ${size === "small" ? `font-size: 0.8rem;` : ``}
          ${red ? `color: red;` : ``}
          line-height: 100%;
        }
      `}
    >
      <span>
        {Number.isNaN(Number(value))
          ? value
          : Number(value).toLocaleString("en") ?? ""}
      </span>
    </div>
  );
}
