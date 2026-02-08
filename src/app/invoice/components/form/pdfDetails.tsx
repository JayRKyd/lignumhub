/* eslint-disable jsx-a11y/alt-text */
import { View, Text, Image } from "@react-pdf/renderer";
import { format } from "date-fns";
import { currencyList } from "@/lib/invoice/currency";
import { pdfTypography, pdfContainers } from "@/lib/invoice/pdfStyles";
import type { YourDetails, CompanyDetails, InvoiceItemDetails, PaymentDetails, InvoiceTerms, Item } from "@/types/types";

interface PdfDetailsProps {
  yourDetails: YourDetails;
  companyDetails: CompanyDetails;
  invoiceDetails: InvoiceItemDetails;
  paymentDetails: PaymentDetails;
  invoiceTerms: InvoiceTerms;
  countryImageUrl: string;
}

export const PdfDetails = ({
  yourDetails,
  companyDetails,
  invoiceDetails,
  paymentDetails,
  invoiceTerms,
  countryImageUrl: _countryImageUrl,
}: PdfDetailsProps) => {
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
    <View>
      {/* Header: Logo left, INVOICE title + company info right */}
      <View style={pdfContainers.header}>
        <View style={pdfContainers.headerLeft}>
          {yourDetails.yourLogo && (
            <Image
              src={yourDetails.yourLogo}
              style={{ height: 50, width: 'auto', objectFit: 'contain' }}
            />
          )}
        </View>
        <View style={pdfContainers.headerRight}>
          <Text style={pdfTypography.invoiceTitle}>INVOICE</Text>
          <View style={pdfContainers.companyInfo}>
            {yourDetails.yourName && (
              <Text style={{ ...pdfTypography.companyName, textAlign: 'right' }}>
                {yourDetails.yourName}
              </Text>
            )}
            {yourDetails.yourAddress && (
              <Text style={{ ...pdfTypography.bodyText, textAlign: 'right' }}>
                {yourDetails.yourAddress}
              </Text>
            )}
            {(yourDetails.yourCity || yourDetails.yourState) && (
              <Text style={{ ...pdfTypography.bodyText, textAlign: 'right' }}>
                {[yourDetails.yourCity, yourDetails.yourState].filter(Boolean).join(", ")}
              </Text>
            )}
            {yourDetails.yourCountry && (
              <Text style={{ ...pdfTypography.bodyText, textAlign: 'right' }}>
                {yourDetails.yourCountry}
              </Text>
            )}
            {yourDetails.yourEmail && (
              <Text style={{ ...pdfTypography.bodyText, textAlign: 'right', marginTop: 6 }}>
                {yourDetails.yourEmail}
              </Text>
            )}
            {yourDetails.yourTaxId && (
              <Text style={{ ...pdfTypography.bodyText, textAlign: 'right' }}>
                Tax ID: {yourDetails.yourTaxId}
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* Bill To section + Invoice metadata */}
      <View style={pdfContainers.billToSection}>
        <View style={pdfContainers.billToLeft}>
          <Text style={{ ...pdfTypography.sectionLabel, marginBottom: 8 }}>BILL TO</Text>
          {companyDetails.companyName && (
            <Text style={pdfTypography.companyName}>{companyDetails.companyName}</Text>
          )}
          {companyDetails.companyAddress && (
            <Text style={pdfTypography.bodyText}>{companyDetails.companyAddress}</Text>
          )}
          {(companyDetails.companyCity || companyDetails.companyState) && (
            <Text style={pdfTypography.bodyText}>
              {[companyDetails.companyCity, companyDetails.companyState].filter(Boolean).join(", ")}
            </Text>
          )}
          {companyDetails.companyCountry && (
            <Text style={pdfTypography.bodyText}>{companyDetails.companyCountry}</Text>
          )}
          {companyDetails.email && (
            <Text style={{ ...pdfTypography.bodyText, marginTop: 6 }}>{companyDetails.email}</Text>
          )}
          {companyDetails.companyTaxId && (
            <Text style={pdfTypography.bodyText}>Tax ID: {companyDetails.companyTaxId}</Text>
          )}
        </View>
        <View style={pdfContainers.billToRight}>
          <View style={pdfContainers.metaRow}>
            <Text style={pdfTypography.metaLabel}>Invoice Number:</Text>
            <Text style={pdfTypography.metaValue}>{invoiceTerms.invoiceNumber || "-"}</Text>
          </View>
          <View style={pdfContainers.metaRow}>
            <Text style={pdfTypography.metaLabel}>Invoice Date:</Text>
            <Text style={pdfTypography.metaValue}>
              {invoiceTerms.issueDate ? format(invoiceTerms.issueDate, "MMMM d, yyyy") : "-"}
            </Text>
          </View>
          <View style={pdfContainers.metaRow}>
            <Text style={pdfTypography.metaLabel}>Due Date:</Text>
            <Text style={pdfTypography.metaValue}>
              {invoiceTerms.dueDate ? format(invoiceTerms.dueDate, "MMMM d, yyyy") : "-"}
            </Text>
          </View>
          <View style={pdfContainers.totalBox}>
            <Text style={{ ...pdfTypography.metaLabel, fontWeight: 'bold' }}>Invoice Total ({currency}):</Text>
            <Text style={pdfTypography.totalAmount}>
              {currencySymbol}{addCommasToNumber(totalAmount)}
            </Text>
          </View>
        </View>
      </View>

      {/* Items Table */}
      <View style={{ marginTop: 20 }}>
        {/* Table Header - Full Width */}
        <View style={{
          backgroundColor: invoiceDetails.accentColor || '#1a5f5a',
          display: 'flex',
          flexDirection: 'row',
          paddingVertical: 10,
          paddingHorizontal: 40,
        }}>
          <Text style={{ ...pdfTypography.tableHeader, flex: 3 }}>Services</Text>
          <Text style={{ ...pdfTypography.tableHeader, flex: 1, textAlign: 'center' }}>Quantity</Text>
          <Text style={{ ...pdfTypography.tableHeader, flex: 1, textAlign: 'right' }}>Rate</Text>
          <Text style={{ ...pdfTypography.tableHeader, flex: 1, textAlign: 'right' }}>Amount</Text>
        </View>

        {/* Table Rows */}
        {invoiceDetails.items.map((item, index) => (
          <View key={index} style={{
            display: 'flex',
            flexDirection: 'row',
            paddingVertical: 12,
            paddingHorizontal: 40,
            borderBottom: '1px solid #e5e7eb',
          }}>
            <View style={{ flex: 3 }}>
              <Text style={pdfTypography.tableCell}>{item.itemDescription || "-"}</Text>
            </View>
            <Text style={{ ...pdfTypography.tableCell, flex: 1, textAlign: 'center' }}>
              {item.qty || 1}
            </Text>
            <Text style={{ ...pdfTypography.tableCell, flex: 1, textAlign: 'right' }}>
              {currencySymbol}{item.amount ? addCommasToNumber(+item.amount) : "0.00"}
            </Text>
            <Text style={{ ...pdfTypography.tableCell, flex: 1, textAlign: 'right' }}>
              {currencySymbol}{addCommasToNumber((item.qty || 1) * (item.amount ? +item.amount : 0))}
            </Text>
          </View>
        ))}
      </View>

      {/* Totals Section */}
      <View style={pdfContainers.totalsSection}>
        <View style={pdfContainers.totalsBox}>
          <View style={pdfContainers.totalsRow}>
            <Text style={pdfTypography.subtotalLabel}>Subtotal:</Text>
            <Text style={pdfTypography.subtotalValue}>
              {currencySymbol}{addCommasToNumber(subtotal)}
            </Text>
          </View>
          {discountAmount > 0 && (
            <View style={pdfContainers.totalsRow}>
              <Text style={pdfTypography.subtotalLabel}>Discount:</Text>
              <Text style={pdfTypography.subtotalValue}>
                -{currencySymbol}{addCommasToNumber(discountAmount)}
              </Text>
            </View>
          )}
          {taxRate > 0 && (
            <View style={pdfContainers.totalsRow}>
              <Text style={pdfTypography.subtotalLabel}>VAT {taxRate}%:</Text>
              <Text style={pdfTypography.subtotalValue}>
                {currencySymbol}{addCommasToNumber(+taxAmount.toFixed(2))}
              </Text>
            </View>
          )}
          <View style={pdfContainers.totalsFinalRow}>
            <Text style={{ ...pdfTypography.subtotalLabel, fontWeight: 'bold' }}>Total:</Text>
            <Text style={pdfTypography.totalAmount}>
              {currencySymbol}{addCommasToNumber(totalAmount)}
            </Text>
          </View>
          <View style={pdfContainers.finalTotalBox}>
            <Text style={{ ...pdfTypography.subtotalLabel, fontWeight: 'bold' }}>
              Invoice Total ({currency}):
            </Text>
            <Text style={pdfTypography.totalAmount}>
              {currencySymbol}{addCommasToNumber(totalAmount)}
            </Text>
          </View>
        </View>
      </View>

      {/* Note Section */}
      {invoiceDetails.note && (
        <View style={pdfContainers.noteSection}>
          <Text style={{ ...pdfTypography.sectionLabel, marginBottom: 4 }}>Note</Text>
          <Text style={pdfTypography.bodyText}>{invoiceDetails.note}</Text>
        </View>
      )}

      {/* Bank Details Section */}
      {(paymentDetails.bankName || paymentDetails.accountNumber) && (
        <View style={pdfContainers.bankDetailsSection}>
          <Text style={{ ...pdfTypography.sectionLabel, marginBottom: 8 }}>Payment Details</Text>
          <View style={{ display: 'flex', flexDirection: 'row', gap: 40 }}>
            <View style={{ flex: 1 }}>
              {paymentDetails.bankName && (
                <View style={{ marginBottom: 4 }}>
                  <Text style={{ ...pdfTypography.bodyText, color: '#9ca3af' }}>Bank Name</Text>
                  <Text style={pdfTypography.bodyText}>{paymentDetails.bankName}</Text>
                </View>
              )}
              {paymentDetails.accountNumber && (
                <View style={{ marginBottom: 4 }}>
                  <Text style={{ ...pdfTypography.bodyText, color: '#9ca3af' }}>Account Number</Text>
                  <Text style={pdfTypography.bodyText}>{paymentDetails.accountNumber}</Text>
                </View>
              )}
              {paymentDetails.accountName && (
                <View style={{ marginBottom: 4 }}>
                  <Text style={{ ...pdfTypography.bodyText, color: '#9ca3af' }}>Account Name</Text>
                  <Text style={pdfTypography.bodyText}>{paymentDetails.accountName}</Text>
                </View>
              )}
              {paymentDetails.swiftCode && (
                <View style={{ marginBottom: 4 }}>
                  <Text style={{ ...pdfTypography.bodyText, color: '#9ca3af' }}>Swift Code</Text>
                  <Text style={pdfTypography.bodyText}>{paymentDetails.swiftCode}</Text>
                </View>
              )}
              {paymentDetails.transitNumber && (
                <View style={{ marginBottom: 4 }}>
                  <Text style={{ ...pdfTypography.bodyText, color: '#9ca3af' }}>Transit Number</Text>
                  <Text style={pdfTypography.bodyText}>{paymentDetails.transitNumber}</Text>
                </View>
              )}
              {paymentDetails.routingCode && (
                <View style={{ marginBottom: 4 }}>
                  <Text style={{ ...pdfTypography.bodyText, color: '#9ca3af' }}>Routing Code</Text>
                  <Text style={pdfTypography.bodyText}>{paymentDetails.routingCode}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      )}
    </View>
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
