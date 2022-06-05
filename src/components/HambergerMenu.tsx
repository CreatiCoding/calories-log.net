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
      <svg viewBox="0 0 80 70" width="30" height="30">
        <rect width="80" height="10"></rect>
        <rect y="30" width="80" height="10"></rect>
        <rect y="60" width="80" height="10"></rect>
      </svg>
      {(children = !null && children)}
    </button>
  );
}
