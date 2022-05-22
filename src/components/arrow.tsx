import { css } from "@emotion/react";

interface ArrowInterface {
  onClick?: () => void;
}

const Arrow = {
  Left: ({ onClick = () => {} }: ArrowInterface) => {
    return (
      <div
        onClick={onClick}
        css={css`
          font-size: 2rem;
          cursor: pointer;
        `}
      >
        <p>👈</p>
      </div>
    );
  },
  Right: ({ onClick = () => {} }: ArrowInterface) => {
    return (
      <div
        onClick={onClick}
        css={css`
          font-size: 2rem;
          cursor: pointer;
        `}
      >
        <p>👉</p>
      </div>
    );
  },
};

export default Arrow;
