import { css } from "@emotion/react";

interface LabelProps {
  value?: string | number;
  bold?: boolean;
  big?: boolean;
  red?: boolean;
}

export default function Label({
  value,
  bold = false,
  big = false,
  red = false,
}: LabelProps) {
  return (
    <div
      css={css`
        span {
          ${bold ? `font-weight: bold;` : ``}
          ${big ? `font-size: 1.4rem;` : ``}
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
