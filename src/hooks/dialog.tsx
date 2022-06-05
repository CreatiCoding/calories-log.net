import { css } from "@emotion/react";
import { useState } from "react";

interface DialogProps {
  className?: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  keywords?: string[];
  onClick: (keyword?: string) => void;
}

function Dialog({
  className,
  open,
  setOpen,
  keywords = [],
  onClick = () => {},
}: DialogProps) {
  if (!open) return null;

  const component: React.ReactNode = (
    <div
      className={className}
      onClick={() => {
        setOpen(false);
      }}
    >
      <div
        css={css`
          width: 300px;
          display: grid;
          align-items: center;
          align-content: space-evenly;
          text-align: center;
        `}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {keywords.map((keyword) => (
          <p
            key={keyword}
            onClick={(e) => {
              e.preventDefault();
              onClick(keyword);
              setOpen(false);
            }}
          >
            {keyword}
          </p>
        ))}
      </div>
    </div>
  );

  return component;
}

export function useDialog() {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<any[]>([]);

  const dialog = function DefaultDialog({
    className,
    keywords,
    onClick,
  }: {
    className?: string;
    keywords?: string[];
    onClick: (keyword: string, values: any[]) => void;
  }) {
    return (
      <Dialog
        css={css`
          position: fixed;
          top: 0;
          left: 0;
          background: rgba(0, 0, 0, 0.75);
          width: 100vw;
          height: 100vh;
          & > div {
            background-color: white;
            width: 75vw;
            height: ${keywords == null ? 0 : keywords.length * 100}px;
            position: relative;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            border-radius: 16px;
            p {
              margin: 10px;
              padding: 10px;
              font-weight: bold;
              border: solid 3px;
              border-radius: 16px;
            }
          }
        `}
        className={className}
        keywords={keywords}
        open={open}
        setOpen={setOpen}
        onClick={(keyword) => {
          if (keyword == null) {
            return setOpen(false);
          }

          onClick(keyword, values);
          setOpen(false);
        }}
      />
    );
  };

  return [
    dialog,
    (...values: any[]) => {
      setOpen(true);
      setValues(values);
    },
    (...values: any[]) => {
      setOpen(false);
    },
  ] as const;
}
