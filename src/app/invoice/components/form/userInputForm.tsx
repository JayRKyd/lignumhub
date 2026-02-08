"use client";

import { DownloadInvoiceButton } from "@/app/invoice/components/form/downloadInvoice/downloadInvoiceButton";
import { InvoiceDetailsForm } from "@/app/invoice/components/form/invoiceDetails/invoiceDetailsForm";
import { InvoiceTermsForm } from "@/app/invoice/components/form/invoiceTerms/invoiceTermsForm";
import { PaymentDetailsForm } from "@/app/invoice/components/form/paymentDetails/paymentDetailsForm";
import { CompanyDetailsForm } from "@/app/invoice/components/form/companyDetails/companyDetailsForm";
import { YourDetailsForm } from "@/app/invoice/components/form/yourDetails/yourDetailsForm";
import { useGetValue } from "@/app/invoice/hooks/useGetValue";
import { getInitialValue } from "@/lib/invoice/getInitialValue";

export const UserInputForm = () => {
  const step = useGetValue("step", getInitialValue("step", "1"));

  return (
    <div>
      <div className={step === "1" ? "block" : "hidden"}>
        <YourDetailsForm />
      </div>
      <div className={step === "2" ? "block" : "hidden"}>
        <CompanyDetailsForm />
      </div>
      <div className={step === "3" ? "block" : "hidden"}>
        <InvoiceDetailsForm />
      </div>
      <div className={step === "4" ? "block" : "hidden"}>
        <PaymentDetailsForm />
      </div>
      <div className={step === "5" ? "block" : "hidden"}>
        <InvoiceTermsForm />
      </div>
      {step === "6" && <DownloadInvoiceButton />}
    </div>
  );
};
