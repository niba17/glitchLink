"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface TrafficDropCardUIProps {
  clicks: number;
}

export function TrafficDropCardUI({ clicks }: TrafficDropCardUIProps) {
  return (
    <Card className="bg-foreground p-0">
      <CardHeader className="pb-0 text-lg font-semibold text-accent">
        Traffic Drop
      </CardHeader>
      <CardContent>
        <div className="text-6xl font-bold text-center text-accent">
          {clicks.toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
}
