"use client";
import CustomTextInput from "@/app/invoice/components/ui/customTextInput";
import DateInput from "@/app/invoice/components/ui/dateInput";

export const InvoiceTermsForm = () => (
  <div className="pt-24">
    <p className="text-2xl font-semibold pb-3 dark:text-gray-100">Invoice terms</p>
    <CustomTextInput
      label="Invoice number"
      placeholder="INVOICE-01"
      variableName="invoiceNo"
    />
    <DateInput label="Issue date" variableName="issueDate" />
    <DateInput label="Due date" variableName="dueDate" />
  </div>
);
