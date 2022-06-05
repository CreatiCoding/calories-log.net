import { css } from "@emotion/react";

interface LabelProps {
  value?: string | number;
  bold?: boolean;
  size?: "big" | "small";
  red?: boolean;
}

export function Label({ value, bold = false, size, red = false }: LabelProps) {
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
