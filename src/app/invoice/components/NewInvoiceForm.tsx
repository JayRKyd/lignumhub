"use client";
import { UserInputForm } from "@/app/invoice/components/form/userInputForm";
import { FormSteps } from "@/app/invoice/components/form/step/fromSteps";
import { UserDataPreview } from "@/app/invoice/components/form/userDataPreview";
import { useForm, FormProvider } from "react-hook-form";
import { useEffect, useState } from "react";
import { FileText } from "lucide-react";

export const NewInvoiceForm = () => {
  const methods = useForm();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsClient(true);
      try {
        const step = localStorage.getItem("step");
        if (!(step && typeof +step === "number"))
          localStorage.setItem("step", "1");
      } catch (e) {
        localStorage.setItem("step", "1");
      }
    }
  }, []);

  return (
    <>
      {isClient ? (
        <FormProvider {...methods}>
          <div className="max-w-lg min-h-screen w-full h-full p-4 md:p-12 border-r border-dashed dark:border-gray-700 flex flex-col justify-between bg-white dark:bg-slate-950">
            <div>
              <div className="flex gap-2 items-center">
                <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                  <FileText className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <p className="font-semibold dark:text-gray-100">Invoice Generator</p>
                  <p className="text-orange-500 text-sm">Create & Download</p>
                </div>
              </div>
              <UserInputForm />
            </div>
            <FormSteps />
          </div>
          <div className="relative min-h-screen h-full w-full flex justify-center items-center p-4 md:p-0 bg-slate-50 dark:bg-slate-900">
            <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] [background-size:16px_16px]"></div>
            <UserDataPreview />
          </div>
        </FormProvider>
      ) : (
        <div className="flex items-center justify-center min-h-screen w-full">
          <div className="animate-pulse text-neutral-500">Loading...</div>
        </div>
      )}
    </>
  );
};
