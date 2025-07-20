import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

export function Spinner({ className, ...props }: ComponentProps<typeof Loader2>) {
  return <Loader2 className={cn("animate-spin", className)} {...props} />;
}

