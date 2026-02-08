"use client";

import { useFormContext } from "react-hook-form";
import type { Item } from "@/types/types";

export const useGetValue = (
  variableName: string,
  defaultValue?: string
): string => {
  const { watch } = useFormContext();
  const value = watch(variableName, defaultValue);
  return value;
};

export const useItemParams = (): Item[] => {
  const { watch } = useFormContext();
  const value = watch("items", []);
  return value;
};
