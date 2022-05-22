import { css } from "@emotion/react";

const ViewPort = {
  pc: css`
    max-width: 1200px;
    padding: 20px 200px 40px;
  `,
  tablet: css`
    max-width: 720px;
  `,
};

export const mobile = css``;

export const tablet = css`
  ${ViewPort.tablet}
`;

export const pc = css`
  ${ViewPort.pc}
`;

export const responseStyle = css`
  @media (min-width: 1170px) {
    ${pc}
  }
  @media (min-width: 768px) and (max-width: 1170px) {
    ${tablet}
  }
  @media (max-width: 768px) {
    ${mobile}
  }
`;
