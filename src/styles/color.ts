import { css } from "@emotion/react";

const BGColor = {
  white: css`
    background-color: rgb(255, 255, 255);
  `,
  lightGray: css`
    background-color: rgb(232, 231, 228);
  `,
};

export const mainColor = css`
  ${BGColor.white}
`;

export const subColor = css`
  ${BGColor.lightGray}
`;
