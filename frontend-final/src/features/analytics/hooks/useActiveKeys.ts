// frontend-final/src/features/analytics/hooks/useActiveKeys.ts

import * as React from "react";
import {
  DeviceKey,
  BrowserKey,
  OSKey,
  ChartKey,
} from "@/features/analytics/types/type";
import {
  devices,
  browsers,
  osList,
} from "@/features/analytics/constants/analyticsKeys";

type ActiveState = {
  devices: DeviceKey[];
  browsers: BrowserKey[];
  osList: OSKey[];
};

type ActiveKeyType = keyof ActiveState;

export const useActiveKeys = () => {
  const [active, setActive] = React.useState<ActiveState>({
    devices: [...devices],
    browsers: [...browsers],
    osList: [...osList],
  });

  const onToggle = React.useCallback(
    (type: ActiveKeyType) => (key: ChartKey) => {
      setActive((prev) => {
        const currentKeys = prev[type] as ChartKey[];
        const newKeys = currentKeys.includes(key)
          ? currentKeys.filter((k) => k !== key)
          : [...currentKeys, key];

        return {
          ...prev,
          [type]: newKeys,
        };
      });
    },
    []
  );

  return { active, onToggle };
};
