import { Label } from "./Label";

interface Label {
  value: string | number;
  useLoading?: boolean;
}
interface DashboardProps {
  className?: string;
  labels: Label[];
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
            value={label.value}
            loading={label.useLoading}
            bold
            red={scale}
            size={scale ? "big" : mod5 ? "small" : undefined}
          />
        );
      })}
    </div>
  );
}
