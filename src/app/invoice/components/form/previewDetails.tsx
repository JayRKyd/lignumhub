/* eslint-disable @next/next/no-img-element */
import { format } from "date-fns";
import { currencyList } from "@/lib/invoice/currency";
import { ChevronDown } from "lucide-react";
import type { YourDetails, CompanyDetails, InvoiceItemDetails, PaymentDetails, InvoiceTerms, Item } from "@/types/types";

interface PreviewDetailsProps {
  yourDetails: YourDetails;
  companyDetails: CompanyDetails;
  invoiceDetails: InvoiceItemDetails;
  paymentDetails: PaymentDetails;
  invoiceTerms: InvoiceTerms;
  onClick?: (step: string) => void;
}

const ClickableSection = ({
  onClick,
  step,
  children,
  className = ""
}: {
  onClick?: (step: string) => void;
  step: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`group cursor-pointer relative ${className}`}
    onClick={() => onClick && onClick(step)}
  >
    {!!onClick && (
      <>
        <ChevronDown className="animate-pulse w-4 h-4 text-orange-500 rotate-[135deg] group-hover:block hidden absolute top-0 left-0 z-10" />
        <ChevronDown className="animate-pulse w-4 h-4 text-orange-500 -rotate-[135deg] group-hover:block hidden absolute top-0 right-0 z-10" />
        <ChevronDown className="animate-pulse w-4 h-4 text-orange-500 rotate-45 group-hover:block hidden absolute bottom-0 left-0 z-10" />
        <ChevronDown className="animate-pulse w-4 h-4 text-orange-500 -rotate-45 group-hover:block hidden absolute bottom-0 right-0 z-10" />
      </>
    )}
    {children}
  </div>
);

export const PreviewDetails = ({
  yourDetails,
  companyDetails,
  invoiceDetails,
  paymentDetails,
  invoiceTerms,
  onClick,
}: PreviewDetailsProps) => {
  const currency = (invoiceDetails.currency || "USD").toUpperCase();
  const currencyDetails = currencyList.find(
    (c) => c.value.toLowerCase() === currency.toLowerCase()
  )?.details;
  const currencySymbol = currencyDetails?.currencySymbol || "$";

  // Calculate totals
  const subtotal = calculateTotalAmount(invoiceDetails.items);
  const discountAmount = invoiceDetails.discount ? +invoiceDetails.discount : 0;
  const afterDiscount = subtotal - discountAmount;
  const taxRate = invoiceDetails.taxRate ? +invoiceDetails.taxRate : 0;
  const taxAmount = afterDiscount * (taxRate / 100);
  const totalAmount = afterDiscount + taxAmount;

  return (
    <div className="overflow-x-auto">
      <div className="w-[595px] min-h-[842px] bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm">

        {/* Header: Logo left, INVOICE title + company info right */}
        <ClickableSection onClick={onClick} step="1" className="px-8 pt-8 pb-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              {yourDetails.yourLogo ? (
                <img
                  src={yourDetails.yourLogo}
                  alt="Logo"
                  className="h-12 w-auto object-contain"
                />
              ) : (
                <div className="h-12 w-24 bg-gray-100 dark:bg-slate-800 rounded animate-pulse" />
              )}
            </div>
            <div className="text-right">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">
                INVOICE
              </h1>
              <div className="mt-2 space-y-0.5">
                {yourDetails.yourName ? (
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    {yourDetails.yourName}
                  </p>
                ) : (
                  <div className="h-4 w-32 bg-gray-100 dark:bg-slate-800 rounded animate-pulse ml-auto" />
                )}
                {yourDetails.yourAddress && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">{yourDetails.yourAddress}</p>
                )}
                {(yourDetails.yourCity || yourDetails.yourState) && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {[yourDetails.yourCity, yourDetails.yourState].filter(Boolean).join(", ")}
                  </p>
                )}
                {yourDetails.yourCountry && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">{yourDetails.yourCountry}</p>
                )}
                {yourDetails.yourEmail && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{yourDetails.yourEmail}</p>
                )}
              </div>
            </div>
          </div>
        </ClickableSection>

        {/* Bill To section + Invoice metadata */}
        <div className="px-8 py-4 flex justify-between">
          {/* Bill To - Left */}
          <ClickableSection onClick={onClick} step="2" className="flex-1">
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-2">
              BILL TO
            </p>
            {companyDetails.companyName ? (
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                {companyDetails.companyName}
              </p>
            ) : (
              <div className="h-4 w-32 bg-gray-100 dark:bg-slate-800 rounded animate-pulse" />
            )}
            {companyDetails.companyAddress && (
              <p className="text-xs text-gray-500 dark:text-gray-400">{companyDetails.companyAddress}</p>
            )}
            {(companyDetails.companyCity || companyDetails.companyState) && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {[companyDetails.companyCity, companyDetails.companyState].filter(Boolean).join(", ")}
              </p>
            )}
            {companyDetails.companyCountry && (
              <p className="text-xs text-gray-500 dark:text-gray-400">{companyDetails.companyCountry}</p>
            )}
            {companyDetails.email && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{companyDetails.email}</p>
            )}
          </ClickableSection>

          {/* Invoice Metadata - Right */}
          <ClickableSection onClick={onClick} step="5" className="w-48">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Invoice Number:</span>
                <span className="text-xs font-medium text-gray-800 dark:text-gray-100">
                  {invoiceTerms.invoiceNumber || "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Invoice Date:</span>
                <span className="text-xs font-medium text-gray-800 dark:text-gray-100">
                  {invoiceTerms.issueDate ? format(invoiceTerms.issueDate, "MMM d, yyyy") : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Due Date:</span>
                <span className="text-xs font-medium text-gray-800 dark:text-gray-100">
                  {invoiceTerms.dueDate ? format(invoiceTerms.dueDate, "MMM d, yyyy") : "-"}
                </span>
              </div>
              <div className="bg-gray-100 dark:bg-slate-800 p-2 rounded mt-2 flex justify-between items-center">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                  Total ({currency}):
                </span>
                <span className="text-sm font-bold text-gray-800 dark:text-gray-100">
                  {currencySymbol}{addCommasToNumber(totalAmount)}
                </span>
              </div>
            </div>
          </ClickableSection>
        </div>

        {/* Items Table */}
        <ClickableSection onClick={onClick} step="3" className="mt-4">
          {/* Table Header */}
          <div className="flex px-8 py-2.5" style={{ backgroundColor: invoiceDetails.accentColor || '#1a5f5a' }}>
            <span className="flex-[3] text-[10px] font-semibold text-white uppercase tracking-wider">
              Services
            </span>
            <span className="flex-1 text-[10px] font-semibold text-white uppercase tracking-wider text-center">
              Quantity
            </span>
            <span className="flex-1 text-[10px] font-semibold text-white uppercase tracking-wider text-right">
              Rate
            </span>
            <span className="flex-1 text-[10px] font-semibold text-white uppercase tracking-wider text-right">
              Amount
            </span>
          </div>

          {/* Table Rows */}
          {invoiceDetails.items.map((item, index) => (
            <div
              key={index}
              className="flex px-8 py-3 border-b border-gray-200 dark:border-slate-700"
            >
              <span className="flex-[3] text-xs text-gray-700 dark:text-gray-300">
                {item.itemDescription || "-"}
              </span>
              <span className="flex-1 text-xs text-gray-700 dark:text-gray-300 text-center">
                {item.qty || 1}
              </span>
              <span className="flex-1 text-xs text-gray-700 dark:text-gray-300 text-right">
                {currencySymbol}{item.amount ? addCommasToNumber(+item.amount) : "0.00"}
              </span>
              <span className="flex-1 text-xs text-gray-700 dark:text-gray-300 text-right">
                {currencySymbol}{addCommasToNumber((item.qty || 1) * (item.amount ? +item.amount : 0))}
              </span>
            </div>
          ))}
        </ClickableSection>

        {/* Totals Section */}
        <div className="px-8 mt-4 flex justify-end">
          <div className="w-56">
            <div className="flex justify-between py-1.5 border-b border-gray-200 dark:border-slate-700">
              <span className="text-xs text-gray-600 dark:text-gray-400">Subtotal:</span>
              <span className="text-xs text-gray-700 dark:text-gray-300">
                {currencySymbol}{addCommasToNumber(subtotal)}
              </span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between py-1.5 border-b border-gray-200 dark:border-slate-700">
                <span className="text-xs text-gray-600 dark:text-gray-400">Discount:</span>
                <span className="text-xs text-gray-700 dark:text-gray-300">
                  -{currencySymbol}{addCommasToNumber(discountAmount)}
                </span>
              </div>
            )}
            {taxRate > 0 && (
              <div className="flex justify-between py-1.5 border-b border-gray-200 dark:border-slate-700">
                <span className="text-xs text-gray-600 dark:text-gray-400">VAT {taxRate}%:</span>
                <span className="text-xs text-gray-700 dark:text-gray-300">
                  {currencySymbol}{addCommasToNumber(+taxAmount.toFixed(2))}
                </span>
              </div>
            )}
            <div className="flex justify-between py-2 border-t-2 border-gray-300 dark:border-slate-600 mt-1">
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Total:</span>
              <span className="text-sm font-bold text-gray-800 dark:text-gray-100">
                {currencySymbol}{addCommasToNumber(totalAmount)}
              </span>
            </div>
            <div className="bg-gray-100 dark:bg-slate-800 p-2.5 rounded mt-1 flex justify-between items-center">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                Invoice Total ({currency}):
              </span>
              <span className="text-sm font-bold text-gray-800 dark:text-gray-100">
                {currencySymbol}{addCommasToNumber(totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Note Section */}
        {invoiceDetails.note && (
          <div className="px-8 mt-6">
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1">
              Note
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{invoiceDetails.note}</p>
          </div>
        )}

        {/* Payment Details Section */}
        {(paymentDetails.bankName || paymentDetails.accountNumber) && (
          <ClickableSection onClick={onClick} step="4" className="px-8 mt-6 pt-4 pb-8 border-t border-gray-200 dark:border-slate-700">
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-3">
              Payment Details
            </p>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              {paymentDetails.bankName && (
                <div>
                  <p className="text-[10px] text-gray-400">Bank Name</p>
                  <p className="text-xs text-gray-700 dark:text-gray-300">{paymentDetails.bankName}</p>
                </div>
              )}
              {paymentDetails.accountNumber && (
                <div>
                  <p className="text-[10px] text-gray-400">Account Number</p>
                  <p className="text-xs text-gray-700 dark:text-gray-300">{paymentDetails.accountNumber}</p>
                </div>
              )}
              {paymentDetails.accountName && (
                <div>
                  <p className="text-[10px] text-gray-400">Account Name</p>
                  <p className="text-xs text-gray-700 dark:text-gray-300">{paymentDetails.accountName}</p>
                </div>
              )}
              {paymentDetails.swiftCode && (
                <div>
                  <p className="text-[10px] text-gray-400">Swift Code</p>
                  <p className="text-xs text-gray-700 dark:text-gray-300">{paymentDetails.swiftCode}</p>
                </div>
              )}
              {paymentDetails.transitNumber && (
                <div>
                  <p className="text-[10px] text-gray-400">Transit Number</p>
                  <p className="text-xs text-gray-700 dark:text-gray-300">{paymentDetails.transitNumber}</p>
                </div>
              )}
              {paymentDetails.routingCode && (
                <div>
                  <p className="text-[10px] text-gray-400">Routing Code</p>
                  <p className="text-xs text-gray-700 dark:text-gray-300">{paymentDetails.routingCode}</p>
                </div>
              )}
            </div>
          </ClickableSection>
        )}
      </div>
    </div>
  );
};

const calculateTotalAmount = (items: Item[]): number =>
  items.reduce((total, item) => {
    const quantity = item.qty ? +item.qty : 1;
    const amount = item.amount ? +item.amount : 0;
    return total + quantity * amount;
  }, 0);

const addCommasToNumber = (number: number): string => {
  const fixed = number.toFixed(2);
  const parts = fixed.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
};
