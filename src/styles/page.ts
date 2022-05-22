import { css } from "@emotion/react";
import { mainColor } from "./color";
import { responseStyle } from "./responsive";

export const pageStyle = css`
  ${mainColor}
  & > div {
    ${mainColor}
    ${responseStyle}
  }
  footer {
    ${mainColor}
    ${responseStyle}
  }
`;