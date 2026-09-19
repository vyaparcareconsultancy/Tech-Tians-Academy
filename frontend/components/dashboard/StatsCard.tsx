import * as React from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui";
import { cn } from "@/lib/utils";

export interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  subtext?: string;
  iconColor?: string;
  bgColor?: string;
}

export function StatsCard({
  label,
  value,
  icon: Icon,
  subtext,
  iconColor = "text-brand-blue",
  bgColor = "bg-brand-blue/10",
}: StatsCardProps) {
  return (
    <Card variant="default" className="relative overflow-hidden transition-all hover:border-brand-blue/40">
      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-body-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-h2 font-bold tracking-tight text-foreground">{value}</p>
            {subtext && (
              <p className="text-caption text-muted-foreground">{subtext}</p>
            )}
          </div>
          <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", bgColor, iconColor)}>
            <Icon className="h-6 w-6" aria-hidden="true" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
