import { css } from "@emotion/react";

interface LabelProps {
  name: string;
  value: string | number;
}
export default function Label({ name, value }: LabelProps) {
  return (
    <>
      <span
        css={css`
          font-weight: bold;
        `}
      >
        {name}
      </span>
      <div
        css={css`
          display: inline-block;
          width: 4px;
        `}
      />
      <span
        css={css`
          font-weight: bold;
          font-size: 1.4rem;
          color: red;
        `}
      >
        {value}
      </span>
    </>
  );
}
