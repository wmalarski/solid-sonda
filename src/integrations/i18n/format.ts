import { createMemo } from "solid-js";
import { useI18n } from ".";

export const createByteUnitFormatter = () => {
  const { locale } = useI18n();

  return createMemo(() => {
    return new Intl.NumberFormat(locale(), {
      notation: "compact",
      style: "unit",
      unit: "byte",
      unitDisplay: "narrow",
    });
  });
};
