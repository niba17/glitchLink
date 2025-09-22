import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface TrafficSourceCardUIProps {
  clicks: number;
}

export function TrafficSourceCardUI({ clicks }: TrafficSourceCardUIProps) {
  return (
    <Card className="bg-foreground p-5">
      <CardHeader className="p-0 text-lg font-semibold text-accent">
        Traffic Source
      </CardHeader>
      <CardContent className="p-0">
        <div className="text-6xl font-bold text-center text-accent">
          {/* {clicks.toLocaleString()} */}
        </div>
      </CardContent>
    </Card>
  );
}
