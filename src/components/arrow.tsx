import { css } from "@emotion/react";

interface ArrowInterface {
  onClick?: () => void;
}

const Arrow = {
  Left: ({ onClick = () => {} }: ArrowInterface) => {
    return (
      <button
        onClick={onClick}
        css={css`
          border: none;
          background: none;
          font-size: 2rem;
          cursor: pointer;
        `}
      >
        👈
      </button>
    );
  },
  Right: ({ onClick = () => {} }: ArrowInterface) => {
    return (
      <button
        onClick={onClick}
        css={css`
          border: none;
          background: none;
          font-size: 2rem;
          cursor: pointer;
        `}
      >
        👉
      </button>
    );
  },
};

export default Arrow;
