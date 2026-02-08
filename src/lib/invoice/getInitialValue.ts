"use client";

import type { Item } from "@/types/types";

export const getInitialValue = (variableName: string, defaultValue?: string): string => {
  try {
    return localStorage.getItem(variableName) || defaultValue || "";
  } catch (_error) {
    // eslint-disable-next-line no-console
    console.error("Error while getting item from local storage:", _error);
    return defaultValue || "";
  }
};

export const getItemValue = (): Item[] => {
  try {
    return getItems(localStorage.getItem("items"));
  } catch (_error) {
    // eslint-disable-next-line no-console
    console.error("Error while getting item from local storage:", _error);
    return [
      {
        itemDescription: "",
      },
    ];
  }
};

const getItems = (items?: string | null): Item[] => {
  if (!items)
    return [
      {
        itemDescription: "",
      },
    ];
  try {
    return JSON.parse(items);
  } catch {
    return [
      {
        itemDescription: "",
      },
    ];
  }
};
