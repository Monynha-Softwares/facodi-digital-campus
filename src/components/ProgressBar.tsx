import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  /**
   * Percentual de progresso entre 0 e 100
   */
  value: number;
}

export const ProgressBar = ({ value }: ProgressBarProps) => {
  return <Progress value={value} className="h-2" />;
};
