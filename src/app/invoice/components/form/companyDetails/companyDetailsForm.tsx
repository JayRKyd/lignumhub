"use client";

import { useState } from "react";
import CustomTextInput from "@/app/invoice/components/ui/customTextInput";
import ImageInput from "@/app/invoice/components/ui/imageInput";
import { CustomerSelector } from "@/app/invoice/components/ui/customerSelector";
import type { Customer } from "@/types/types";

const CompanyDetailsFormContent = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  return (
    <div className="pt-24">
      <p className="text-2xl font-semibold pb-3 dark:text-gray-100">Customer Details (Bill To)</p>

      {/* Customer Selector */}
      <CustomerSelector onCustomerSelect={setSelectedCustomer} />

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
        <p className="pb-4 text-sm font-medium text-neutral-500">
          {selectedCustomer
            ? "Customer details loaded. You can edit them below if needed."
            : "Or enter customer details manually below."}
        </p>
      </div>

      <CustomTextInput
        label="Email"
        placeholder="e.g. contact@client.com"
        variableName="email"
      />
      <CustomTextInput
        label="Company / Customer Name"
        placeholder="Acme Ltd"
        variableName="companyName"
      />
      <ImageInput label="Logo" variableName="companyLogo" />
      <CustomTextInput
        label="Street Address"
        placeholder="123 Bay Street, Suite 100"
        variableName="companyAddress"
      />
      <CustomTextInput
        label="City / Town"
        placeholder="Nassau"
        variableName="companyCity"
      />
      <CustomTextInput
        label="Island"
        placeholder="New Providence"
        variableName="companyState"
      />
      <CustomTextInput
        label="P.O. Box"
        placeholder="P.O. Box N-1234"
        variableName="companyZip"
      />
      <CustomTextInput
        label="Country"
        placeholder="Bahamas"
        variableName="companyCountry"
      />
      <CustomTextInput
        label="Tax ID / Business License"
        placeholder="BL-12345"
        variableName="companyTaxId"
      />
    </div>
  );
};

export const CompanyDetailsForm = () => (
  <CompanyDetailsFormContent />
);
