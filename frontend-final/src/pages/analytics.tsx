import { ChartLineInteractive } from "@/components/common/testLineChart";
import DateRangePicker from "@/components/ui/date-range-picker";
import React from "react";

export default function analyticsPage() {
  return (
    <div className="bg-zinc-950 min-h-screen px-[145px] py-10 space-y-[10px]">
      <ul className="grid grid-cols-4 gap-3">
        <li className="bg-zinc-800 p-[20px] rounded-sm w-full">
          <div className="flex flex-col space-y-[0.5px]">
            <span
              title="Visit short link"
              className="text-[#1de2ae] break-all text-lg"
            >
              Shortlink
            </span>
          </div>
        </li>
        <li className="bg-zinc-800 p-[20px] rounded-sm w-full">
          <div className="flex flex-col space-y-[0.5px]">
            <span
              title="Visit short link"
              className="text-[#1de2ae] break-all text-lg"
            >
              Total clicks
            </span>
          </div>
        </li>
        <li className="bg-zinc-800 p-[20px] rounded-sm w-full">
          <div className="flex flex-col space-y-[0.5px]">
            <span
              title="Visit short link"
              className="text-[#1de2ae] break-all text-lg"
            >
              Latest click
            </span>
          </div>
        </li>
        <li className="bg-zinc-800 p-[20px] rounded-sm w-full">
          <div className="flex flex-col space-y-[0.5px]">
            <span
              title="Visit short link"
              className="text-[#1de2ae] break-all text-lg"
            >
              Alive shortlink
            </span>
            <span
              title="Visit short link"
              className="text-[#1de2ae] break-all text-lg"
            >
              Dead shortlink
            </span>
          </div>
        </li>
      </ul>

      {/* <ChartAreaInteractive /> */}
      <ChartLineInteractive />
      {/* <DateRangePicker /> */}
    </div>
  );
}
