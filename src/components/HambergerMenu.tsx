import { css } from "@emotion/react";

interface Props {
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

export function HambergerMenu({ children, className, onClick }: Props) {
  return (
    <button
      css={css`
        background-color: unset;
        border: 0;
      `}
      className={className}
      onClick={onClick}
    >
      <svg viewBox="0 0 80 80" width="25" height="25">
        <rect x="35" y="10" width="10" height="10"></rect>
        <rect x="35" y="40" width="10" height="10"></rect>
        <rect x="35" y="70" width="10" height="10"></rect>
      </svg>
      {(children = !null && children)}
    </button>
  );
}
