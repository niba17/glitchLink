"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface TrafficSpikeCardUIProps {
  clicks: number;
}

export function TrafficSpikeCardUI({ clicks }: TrafficSpikeCardUIProps) {
  return (
    <Card className="bg-foreground p-0">
      <CardHeader className="pb-0 text-lg font-semibold text-accent">
        Traffic Spike
      </CardHeader>
      <CardContent>
        <div className="text-6xl font-bold text-center text-accent">
          {clicks.toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
}
