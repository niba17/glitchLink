"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface BounceRateCardUIProps {
  clicks: number;
}

export function BounceRateCardUI({ clicks }: BounceRateCardUIProps) {
  return (
    <Card className="bg-foreground p-0">
      <CardHeader className="pb-0 text-lg font-semibold text-accent">
        Bounce Rate
      </CardHeader>
      <CardContent>
        <div className="text-6xl font-bold text-center text-accent">
          {/* {clicks.toLocaleString()} */}
        </div>
      </CardContent>
    </Card>
  );
}
