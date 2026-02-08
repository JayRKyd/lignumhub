import { NewInvoiceForm } from "@/app/invoice/components/NewInvoiceForm";
import { Suspense } from "react";

const Page = () => (
  <div className="min-h-screen overflow-y-auto h-full flex items-center md:flex-row flex-col-reverse">
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen w-full">Loading...</div>}>
      <NewInvoiceForm />
    </Suspense>
  </div>
);

export default Page;
