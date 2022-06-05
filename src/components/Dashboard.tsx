import { Label } from "./Label";

interface DashboardProps {
  className?: string;
  labels: Array<string | number>;
}

export function Dashboard({ className, labels }: DashboardProps) {
  if (labels.length === 0) return null;

  return (
    <div className={className}>
      {labels.map((label, index) => {
        const mod5 = Math.floor(index % 5);
        const scale = Math.floor(mod5 % 2) === 0 && mod5 !== 0;
        return (
          <Label
            key={`${index}-${label}`}
            value={label}
            bold
            red={scale}
            big={scale}
          />
        );
      })}
    </div>
  );
}
