import { css } from "@emotion/react";

interface LabelProps {
  className?: string;
  name: string;
  value?: string | number;
}
export default function Label({ className, name, value }: LabelProps) {
  return (
    <div className={className}>
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
        {value ?? ""}
      </span>
    </div>
  );
}
