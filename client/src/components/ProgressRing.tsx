import { Card } from "@/components/ui/card";

interface ProgressRingProps {
  label: string;
  value: number;
  max: number;
  unit: string;
}

export default function ProgressRing({ label, value, max, unit }: ProgressRingProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <Card className="p-6 flex flex-col items-center">
      <div className="relative">
        <svg width="160" height="160" className="-rotate-90">
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            className="text-muted"
          />
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="text-primary transition-all duration-500"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold" data-testid="text-progress-value">
            {value}
          </div>
          <div className="text-sm text-muted-foreground">
            of {max} {unit}
          </div>
        </div>
      </div>
      <div className="text-center mt-4">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-lg font-semibold mt-1">{Math.round(percentage)}%</p>
      </div>
    </Card>
  );
}
