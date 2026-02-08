"use client";
import CustomTextInput from "@/app/invoice/components/ui/customTextInput";
import CurrencyInput from "@/app/invoice/components/ui/currencyInput";
import { currencyList } from "@/lib/invoice/currency";
import { Input } from "@/app/invoice/components/ui/input";
import { Plus, Trash2, Palette } from "lucide-react";
import CustomNumberInput from "@/app/invoice/components/ui/customNumberInput";
import { useGetValue } from "@/app/invoice/hooks/useGetValue";
import { Controller, useFormContext } from "react-hook-form";
import { getItemValue } from "@/lib/invoice/getInitialValue";
import type { Item } from "@/types/types";

const PRESET_COLORS = [
  { name: "Teal", value: "#1a5f5a" },
  { name: "Navy", value: "#1e3a5f" },
  { name: "Black", value: "#1f2937" },
  { name: "Red", value: "#991b1b" },
  { name: "Purple", value: "#5b21b6" },
  { name: "Blue", value: "#1d4ed8" },
  { name: "Orange", value: "#c2410c" },
  { name: "Green", value: "#166534" },
];

export const InvoiceDetailsForm = () => {
  const value = useGetValue("currency", "USD");
  const accentColor = useGetValue("accentColor", "#1a5f5a");
  const { setValue } = useFormContext();
  const currencyDetails = currencyList.find(
    (currency) => currency.value.toLowerCase() === value.toLowerCase()
  )?.details;

  return (
    <Controller
      render={({ field: { onChange, value } }) => (
        <div className="pt-24">
          <p className="text-2xl font-semibold pb-3 dark:text-gray-100">Invoice Details</p>
          <div className="flex flex-col gap-6">
            <div>
              <p className="pt-3 font-medium text-neutral-500">
                Select an invoice currency
              </p>
              <CurrencyInput />
            </div>
            <div>
              <p className="py-3 font-medium text-sm text-neutral-500">Items</p>
              {value.map(
                ({ itemDescription, amount, qty }: Item, index: number) => (
                  <div
                    className="flex relative items-center group -ml-8"
                    key={index}
                  >
                    <div
                      className={`w-9 h-7 ${value.length === 1 && "invisible"}`}
                    >
                      <button
                        onClick={() => {
                          const newList = [...value];
                          newList.splice(index, 1);
                          localStorage.setItem(
                            "items",
                            JSON.stringify(newList)
                          );
                          onChange(newList);
                        }}
                        type="button"
                        className="flex-shrink-0 rounded-md p-1.5 group-hover:bg-gray-50 dark:group-hover:bg-gray-800 hidden group-hover:block"
                      >
                        <Trash2 className="w-4 text-gray-500 h-4 group-hover:text-red-400" />
                      </button>
                    </div>
                    <div className="w-full flex-1">
                      <Input
                        placeholder="Item name"
                        value={itemDescription}
                        type="text"
                        onChange={(e) => {
                          const updatedArray = [...value];
                          updatedArray[index] = {
                            itemDescription: e.target.value,
                            amount,
                            qty,
                          };
                          localStorage.setItem(
                            "items",
                            JSON.stringify(updatedArray)
                          );
                          onChange(updatedArray);
                        }}
                      />
                    </div>
                    <div className="w-14">
                      <Input
                        placeholder="Qty"
                        value={`${qty || ""}`}
                        type="text"
                        pattern="[0-9]*"
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          if (
                            /^-?\d*\.?\d*$/.test(inputValue) ||
                            inputValue === ""
                          ) {
                            const updatedArray = [...value];
                            updatedArray[index] = {
                              itemDescription,
                              amount,
                              qty: +inputValue,
                            };
                            localStorage.setItem(
                              "items",
                              JSON.stringify(updatedArray)
                            );
                            onChange(updatedArray);
                          }
                        }}
                      />
                    </div>
                    <div className="w-14">
                      <Input
                        placeholder="Price"
                        value={`${amount || ""}`}
                        type="text"
                        pattern="[0-9]*"
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          if (
                            /^-?\d*\.?\d*$/.test(inputValue) ||
                            inputValue === ""
                          ) {
                            const updatedArray = [...value];
                            updatedArray[index] = {
                              itemDescription,
                              amount: +inputValue,
                              qty,
                            };
                            localStorage.setItem(
                              "items",
                              JSON.stringify(updatedArray)
                            );
                            onChange(updatedArray);
                          }
                        }}
                      />
                    </div>
                  </div>
                )
              )}
              <div className="py-3 border-dashed border-b border-gray-300 dark:border-gray-600">
                <button
                  onClick={() => {
                    localStorage.setItem(
                      "items",
                      JSON.stringify([...value, { itemDescription: "" }])
                    );
                    onChange([...value, { itemDescription: "" }]);
                  }}
                  type="button"
                  className="flex justify-center items-center text-orange-500 font-medium text-sm gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <p>Add Item</p>
                </button>
              </div>
            </div>
            <div>
              <p className="pt-3 font-medium text-sm text-neutral-500 pb-5">
                Note
              </p>
              <CustomTextInput placeholder="Add a note" variableName="note" />
            </div>
            <div>
              <p className="pt-3 font-medium text-sm text-neutral-500 pb-5">
                More options
              </p>
              <CustomNumberInput
                label="Discount"
                placeholder={`${currencyDetails?.currencySymbol}0`}
                variableName="discount"
              />
              <CustomNumberInput
                label="Taxes"
                placeholder="0%"
                variableName="tax"
              />
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-neutral-500" />
                  <label className="font-medium text-sm text-neutral-500">
                    Accent Color
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => {
                        setValue("accentColor", color.value);
                        localStorage.setItem("accentColor", color.value);
                      }}
                      className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                        accentColor === color.value
                          ? "border-orange-500 scale-110"
                          : "border-transparent"
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => {
                      setValue("accentColor", e.target.value);
                      localStorage.setItem("accentColor", e.target.value);
                    }}
                    className="w-6 h-6 rounded cursor-pointer border-0 p-0"
                    title="Custom color"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      name="items"
      defaultValue={getItemValue()}
    />
  );
};
